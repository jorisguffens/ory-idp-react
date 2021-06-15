import React from "react";
import clsx from "clsx";

import style from "./center.module.scss";

export default function Center({ vertical, horizontal, fillPage, className, children }) {
    if ( vertical && horizontal ) {
        return (
            <div className={clsx(style.verticalCenterWrapper, fillPage && style.fillPage, className)}>
                <div className={style.verticalCenterContainer}>
                    <div className={style.horizontalCenterContainer}>
                        {children}
                    </div>
                </div>
            </div>
        )
    }

    if ( vertical ) {
        return (
            <div className={clsx(style.verticalCenterWrapper, fillPage && style.fillPage, className)}>
                <div className={style.verticalCenterContainer}>
                    {children}
                </div>
            </div>
        )
    }

    if ( horizontal ) {
        return (
            <div className={clsx(fillPage && style.fillPage, className)}>
                <div className={style.horizontalCenterContainer}>
                    {children}
                </div>
            </div>
        )
    }

    return (
        <>
            {children}
        </>
    )
}
