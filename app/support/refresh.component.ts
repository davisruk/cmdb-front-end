import {Component, Input, Output, EventEmitter} from '@angular/core';
import { MessageService } from '../service/message.service';
import { RefreshService } from "./refresh.service";

@Component({
    selector: 'refresh-component',
    template: '<button pButton type="button" (click)="onRefresh()" icon="fa-refresh" label="Refresh"> </button>'
})
export class RefreshComponent{
    
    @Input() dataService: RefreshService;
    @Input() dataId: number;
    @Output() dataRefresh: EventEmitter<any> = new EventEmitter<any>();
    @Input() messageService: MessageService;
    dataObject:any;

    onRefresh(){
        this.dataService.refreshData(this.dataId)
        .subscribe(
            (dataObject:any) => {
                this.dataObject = dataObject;
                this.dataRefresh.emit(dataObject);
            },
            (error:any) =>  this.messageService.error('ngOnInit error', error)
        );
    }
}