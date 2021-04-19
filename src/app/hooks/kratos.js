import {Configuration, PublicApi} from '@ory/kratos-client';
import {useEffect, useState} from "react";

const url = window.location.protocol + "//" + window.location.hostname;
console.log(url);
const kratos = new PublicApi(new Configuration({basePath: url}));

// Returns a promise of which the resolve & reject can be executed from outside
export function makePromise() {
    let resolve, reject;
    const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    });

    return {promise, resolve, reject};
}

export function makeSuspender(promise) {
    let result;
    const suspender = promise.then(response => {
        result = response;
        console.log(result);
    }).catch(error => {
        result = error;
    });

    return () => {
        if ( !result ) {
            throw suspender;
        }
        if ( result instanceof Error ) {
            throw result;
        }
        return result;
    };
}

// HOOKS

export function useKratos() {
    return kratos;
}

export function useSuspender(collection, id, init, timeout) {

    const [data, setData] = useState(null);

    function refresh() {
        const promise = init();
        const suspender = makeSuspender(promise);
        promise.then((res) => {
            collection[id] = suspender;
            setData(res);
        });
    }

    if ( data ) {
        return { data, refresh };
    }

    if ( !collection[id] ) {
        const promise = init();
        collection[id] = makeSuspender(promise);

        if ( timeout ) {
            setTimeout(() => {
                delete collection[id];
            }, timeout);
        }
    }

    const result = collection[id]();
    if ( result !== data ) {
        setData(result);
    }
    return { data: result, refresh };
}

const registerFlows = {};
export function useRegisterFlow(flowId) {
    return useSuspender(registerFlows, flowId, () => {
        return kratos.getSelfServiceRegistrationFlow(flowId).then(({data}) => data);
    });
}

const errorViews = {};
export function useErrorView(errorId) {
    return useSuspender(errorViews, errorId, () => {
        return kratos.getSelfServiceError(errorId).then(({data}) => data);
    });
}

const whoamiRequests = {};
export function useAuth() {
    const { data, refresh } = useSuspender(whoamiRequests, 1, () => {
        return kratos.whoami().then(({data}) => data);
        // return fetch("/sessions/whoami", {
        //     credentials: "include"
        // }).then((res) => res.json());
    });

    return { session: data, user: data.identity };
}