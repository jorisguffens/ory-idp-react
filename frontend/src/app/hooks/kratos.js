import {Configuration as KratosConfiguration, V0alpha1Api as KratosPublicApi} from '@ory/kratos-client';
import {useEffect, useState} from "react";

// initialize kratos public api
const url = window.location.protocol + "//" + window.location.hostname + "/.ory/kratos";
const kratos = new KratosPublicApi(new KratosConfiguration({basePath: url}));

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
        if ( user != null ) {
            return Promise.resolve(user);
        }

        return kratos.toSession().then(({data}) => {
            user = data.identity;
            user.firstname = user.traits.name.first;
            user.lastname = user.traits.name.last;
            user.fullname = user.traits.name.first + " " + user.traits.name.last;
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
export function submitForm(url, method, nodes, return_to = null) {
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
        redirect: return_to != null ? "manual" : "follow",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(res => {
        if ( return_to ) {
            window.location.href = return_to;
            return;
        }
        console.log(res.url);
        window.location.href = res.url;
        return false;
    });
}

export function logout() {
    kratos.createSelfServiceLogoutFlowUrlForBrowsers().then(res => {
        window.location.href = res.data.logout_url;
    });
}