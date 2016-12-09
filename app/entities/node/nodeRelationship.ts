import {Node} from './node' 
export class NodeRelationship{
    id : number;
    publishingNode : Node;
    consumingNode : Node;
    startPort : number;
    endPort : number;
    protocol : string;
}