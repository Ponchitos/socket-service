import ajv from 'ajv'

interface IRouteValidators {
    request?: object;
    response?: object;
    params?: object;
    headers?: object;
}

interface IAjvCompilerObj {
    request: ajv.ValidateFunction | null;
    response: ajv.ValidateFunction | null;
    params: ajv.ValidateFunction | null;
    headers: ajv.ValidateFunction | null;
}


export interface ISchemaValidators {
    [key: string]: {
        [key: string]: {
            [key: string]: IAjvCompilerObj
        } | IAjvCompilerObj
    }
}


const ajvCompilerObj = (ajv: ajv.Ajv, routeValidators: IRouteValidators): IAjvCompilerObj => ({
    request: routeValidators.request ? ajv.compile(routeValidators.request) : null,
    response: routeValidators.response ? ajv.compile(routeValidators.response) : null,
    params: routeValidators.params ? ajv.compile(routeValidators.params) : null,
    headers: routeValidators.headers ? ajv.compile(routeValidators.headers) : null
});

const ajvCompiler = (ajv: ajv.Ajv, schemas: any, level: number = 2): ISchemaValidators => {
    const schemaValidators: ISchemaValidators = {};
    Object.keys(schemas).forEach((controller: string) => {
        schemaValidators[controller] = {};
        [...Object.keys(schemas[controller])].forEach((method: string) => {
            schemaValidators[controller][method] = {};
            if (level === 2) {
                const routeValidators: IRouteValidators = schemas[controller][method];
                schemaValidators[controller][method] = ajvCompilerObj(ajv, routeValidators);
                return;
            }
            [...Object.keys(schemas[controller][method])].forEach((action: string) => {
                const routeValidators: IRouteValidators = schemas[controller][method][action];
                // @ts-ignore
                schemaValidators[controller][method][action] = ajvCompilerObj(ajv, routeValidators);
            });
        });
    });
    return schemaValidators;
};

export default ajvCompiler;