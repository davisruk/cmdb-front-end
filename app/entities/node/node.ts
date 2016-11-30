import { SubEnvironment } from '../environment/subEnvironment';
import { NodeRelationship } from './nodeRelationship';
import { NodeIP } from './nodeIP';
export class Node {
    id: number;
    nodeType: string;
    subEnvironments: SubEnvironment[];
    relationships: NodeRelationship[];
    ipAddresses: NodeIP;

}