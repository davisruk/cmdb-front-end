// Class that is used for Prime NG Data table rendering with Rowspan feature
// Datatable Rowspan does not support "deep" relationships e.g. subenv.env.name
// Instead we must flatten all the classes and include only the attributes
// we require. 
export class FlatSubEnv {
    constructor(public envName : String, public subEnvType : string, public id:number) {
        
    }
}