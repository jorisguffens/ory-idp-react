import React from "react";

import {TextField} from "@material-ui/core";

export default function TraitFields({traits, onChange}) {

    function update(trait, value) {
        trait.value = value;
        onChange([...traits]);
    }

    function parseTraitName(trait) {
        let name = ""
        const parts = trait.name.split(".");
        for (let i = parts.length - 1; i > 0; i--) {
            name += parts[i] + " ";
        }
        return name.substr(0, 1).toUpperCase() + name.substr(1);
    }

    return (
        <>
            {traits.map((trait, i) => {
                const props = {
                    label: parseTraitName(trait),
                    value: trait.value ? trait.value : "",
                    type: trait.type
                };

                if ( i === 0 ) {
                    props.autoFocus = true;
                }

                if ( trait.messages ) {
                    props.error = true;
                    props.helperText = trait.messages[0].text;
                }

                return (
                    <React.Fragment key={i}>
                        <TextField variant="outlined" fullWidth
                                   onChange={(e) => update(trait, e.target.value)}
                                   {...props}
                        />
                        <br/><br/>
                    </React.Fragment>
                )
            })}
        </>
    )
}