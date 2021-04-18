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

export function makeSuspender(fetcher) {
    let result;
    const promise = fetcher();
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
    function unset() {
        delete collection[id];
    }

    if ( collection[id] ) {
        return [collection[id](), unset];
    }

    const suspender = makeSuspender(init);
    collection[id] = () => suspender();

    if ( timeout ) {
        setTimeout(() => {
            delete collection[id];
        }, timeout);
    }

    return [suspender(), unset];
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