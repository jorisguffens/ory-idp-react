import React, {useState} from "react";

import {Button, TextField} from "@material-ui/core";

export default function PasswordForm({ config, onSubmit }) {
    console.log(config);
    const [nodes, setNodes] = useState(config.nodes);

    function update(node, value) {
        node.attributes.value = value;
        setNodes([...nodes]);
    }

    function submit(e) {
        e.preventDefault();
        onSubmit(nodes);
        return false;
    }

    return (
        <form onSubmit={submit}>
            {nodes.filter(node => node.group === "password").map((node, i) => {
                const type = node.attributes.type;

                if ( type === "text" || type === "password" || type === "email" ) {
                    return <NodeTextField key={i} node={node} autoFocus={i === 0} onChange={(value) => update(node, value)}/>
                }
                if ( type === "submit" ) {
                    return <NodeButton key={i} node={node} onClick={submit}/>
                }

                return null;
            })}
        </form>
    )
}

function NodeTextField({ node, autoFocus, onChange }) {
    const label = node.meta && node.meta.label && node.meta.label.text || node.attributes.name; // TODO i18next based on ID

    const props = {...node.attributes};
    if ( node.messages ) {
        props.error = true;
        props.helperText = node.messages[0].text;
    }

    return (
        <>
            <TextField variant="outlined" fullWidth label={label} value={node.attributes.value || ""}
                       onChange={(e) => onChange(e.target.value)}
                       autoFocus={autoFocus}
                       {...props}
            />
            <br/><br/>
        </>
    )
}

function NodeButton({ node, onClick }) {
    const label = node.meta.label.text; // TODO i18next based on ID

    return (
        <Button color={"primary"} variant={"contained"} onClick={onClick} {...node.attributes}>
            {label}
        </Button>
    )
}