/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { CSSProperties, type ReactNode } from "react";
import { ThunderboltOutlined, CodeSandboxOutlined } from "@ant-design/icons";
import styles from "./styles.module.css";
import ReactTooltip from "react-tooltip";

interface Props {
  children: ReactNode;
  minHeight?: number;
  maxHeight?: number;
  url: string;
  bodyPadding?: string;
  marginBottom?: boolean;
  codeDemo?: {
    codesandbox?: string;
    stackblitz?: string;
  };
}

function CodeWindow({
  children,
  minHeight = 240,
  maxHeight = 450,
  bodyPadding = "1rem",
  codeDemo = {},
}: Props): JSX.Element {
  return (
    <div
      className={styles.browserWindow}
      style={{
        minHeight,
        maxHeight,
      }}
    >
      <div className={styles.browserWindowHeader}>
        <div className={styles.buttons}>
          <span className={styles.dot} style={{ background: "#f25f58" }} />
          <span className={styles.dot} style={{ background: "#fbbe3c" }} />
          <span className={styles.dot} style={{ background: "#58cb42" }} />
        </div>
      </div>

      <div
        className={styles.browserWindowBody}
        style={{ bodyPadding } as CSSProperties}
      >
        {children}
      </div>
      {codeDemo.codesandbox || codeDemo.stackblitz ? (
        <div className={styles.browserFooter}>
          {codeDemo.codesandbox ? (
            <span
              data-tip="在 CodeSandbox 中演示"
              onClick={() => window.open(codeDemo.codesandbox)}
            >
              <CodeSandboxOutlined style={{ fontSize: "20px" }} />
            </span>
          ) : null}
          {codeDemo.stackblitz ? (
            <span
              data-tip
              data-for="在 Stackblitz 中演示"
              onClick={() => window.open(codeDemo.stackblitz)}
            >
              <ThunderboltOutlined style={{ fontSize: "20px" }} />
            </span>
          ) : null}
        </div>
      ) : null}
      <ReactTooltip
        place="top"
        type="dark"
        effect="solid"
        aria-haspopup="true"
      />
    </div>
  );
}

export default CodeWindow;
