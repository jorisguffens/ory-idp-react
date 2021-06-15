import {Configuration, PublicApi} from '@ory/kratos-client';
import {useEffect, useState} from "react";

// initialize kratos public api
const url = window.location.protocol + "//" + window.location.hostname + "/.ory/kratos";
const kratos = new PublicApi(new Configuration({basePath: url}));

// hooks
export function useKratos() {
    return kratos;
}

export function useDataLoader(init) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        let change = (func, param) => func(param);
        init().then(data => {
            change(setData, data);
        }).catch(err => {
            change(setError, err);
        }).finally(() => {
            change(setLoading, false);
        });

        return () => {
            change = () => {};
        }
    }, []);

    return { data, error, isLoading };
}

let user = null;
export function useAuth() {
    const { isLoading } = useDataLoader(() => {
        return kratos.toSession().then(({data}) => {
            user = data.identity;
            console.log(user);
            return user;
        });
    });

    return {
        user,
        isAuthenticated: user !== null,
        isLoading
    };
}

export function useSelfServiceError(errorId) {
    const { data, isLoading } = useDataLoader(() => {
        return kratos.getSelfServiceError(errorId).then(({data}) => data);
    });

    return {
        errorInfo: data,
        isLoading
    };
}

// other
export function submitForm(url, method, nodes, routerHistory) {
    const formData = new FormData();
    for (let node of nodes) {
        formData.set(node.attributes.name, node.attributes.value);
    }

    const body = [...formData.entries()]
        .map(e => encodeURIComponent(e[0]) + "=" + encodeURIComponent(e[1]))
        .join("&");

    return fetch(url, {
        method: method,
        credentials: "include",
        body: body,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(res => {
        if ( !res.redirected ) {
            return; // that's unusual
        }

        // just refresh info
        if ( res.url === window.location.href ) {
            return false;
        }

        // go to new page
        const prefix = window.location.protocol + "//" + window.location.hostname;
        if (res.url.startsWith(prefix)) {
            routerHistory.push(res.url.substr(prefix.length));
            //window.location.href = res.url.substr(prefix.length);
            return true;
        }

        return false;
    });
}