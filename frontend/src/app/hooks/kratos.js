import {Configuration, PublicApi} from '@ory/kratos-client';
import {useEffect, useState} from "react";

const url = window.location.protocol + "//" +  window.location.hostname;
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

// HOOKS

export function useKratos() {
    return kratos;
}

export function useRegisterFlow(flowId) {

    const [data, setData] = useState(null);
    const [promise, setPromise] = useState(null);

    if (!data) {
        if (promise == null) {
            const pr = kratos.getSelfServiceRegistrationFlow(flowId)
                .then(({status, data, ...response}) => {
                    setData(data);
                    console.log(data);
                });

            setPromise(pr);
            throw pr;
        }

        throw promise;
    }

    return data;
}