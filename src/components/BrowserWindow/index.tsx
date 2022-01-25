/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { CSSProperties, type ReactNode } from "react";

import styles from "./styles.module.css";

interface Props {
  children: ReactNode;
  minHeight: number;
  url: string;
  bodyPadding: string;
}

function BrowserWindow({
  children,
  minHeight,
  bodyPadding = "1rem",
}: Props): JSX.Element {
  return (
    <div className={styles.browserWindow} style={{ minHeight }}>
      <div className={styles.browserWindowHeader}>
        <div className={styles.buttons}>
          <span className={styles.dot} style={{ background: "#f25f58" }} />
          <span className={styles.dot} style={{ background: "#fbbe3c" }} />
          <span className={styles.dot} style={{ background: "#58cb42" }} />
        </div>
      </div>

      <div
        className={styles.browserWindowBody}
        style={{ "--body-padding": bodyPadding } as CSSProperties}
      >
        {children}
      </div>
    </div>
  );
}

export default BrowserWindow;
