//
// Source code generated by Celerio, a Jaxio product.
// Documentation: http://www.jaxio.com/documentation/celerio/
// Follow us on twitter: @jaxiosoft
// Need commercial support ? Contact us: info@jaxio.com
// Template pack-angular:src/main/webapp/app/app.module.ts.p.vm
//
import { NgModule }       from '@angular/core';
import { BrowserModule  } from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { HttpModule  }    from '@angular/http';
import { RouterModule  }  from '@angular/router';
import { FileUploadModule, PanelModule, GrowlModule, MenubarModule,
        DialogModule, ButtonModule, AutoCompleteModule, DataTableModule,
        DataListModule, SharedModule, DropdownModule,PickListModule,CheckboxModule,
        TriStateCheckboxModule, InputTextModule,InputTextareaModule,
        CalendarModule,PasswordModule,TabViewModule, InputSwitchModule,
        FieldsetModule, InplaceModule, OverlayPanelModule } from 'primeng/primeng';
import { AppComponent }   from './app.component';
import { HomeComponent }  from './home.component';
import { MessageService } from './service/message.service';
import { routing }        from './app.routes';
import { EmailValidator } from './support/email.validator';

import { ComponentConfigService } from './entities/componentConfig/componentConfig.service';
import { ComponentConfigListComponent } from './entities/componentConfig/componentConfig-list.component';
import { ComponentConfigDetailComponent } from './entities/componentConfig/componentConfig-detail.component';
import { ComponentConfigLineComponent } from './entities/componentConfig/componentConfig-line.component';
import { ComponentConfigCompleteComponent } from './entities/componentConfig/componentConfig-auto-complete.component';

import { EnvironmentService } from './entities/environment/environment.service';
import { EnvironmentListComponent } from './entities/environment/environment-list.component';
import { EnvironmentDetailComponent } from './entities/environment/environment-detail.component';
import { SubEnvironmentDetailComponent } from './entities/environment/subEnvironment-detail.component';
import { EnvironmentLineComponent } from './entities/environment/environment-line.component';
import { EnvironmentCompleteComponent } from './entities/environment/environment-auto-complete.component';

import { EnvironmentConfigService } from './entities/environmentConfig/environmentConfig.service';
import { EnvironmentConfigListComponent } from './entities/environmentConfig/environmentConfig-list.component';
import { EnvironmentConfigDetailComponent } from './entities/environmentConfig/environmentConfig-detail.component';
import { EnvironmentConfigLineComponent } from './entities/environmentConfig/environmentConfig-line.component';
import { EnvironmentConfigCompleteComponent } from './entities/environmentConfig/environmentConfig-auto-complete.component';

import { GlobalconfigService } from './entities/globalconfig/globalconfig.service';
import { GlobalconfigListComponent } from './entities/globalconfig/globalconfig-list.component';
import { GlobalconfigDetailComponent } from './entities/globalconfig/globalconfig-detail.component';
import { GlobalconfigLineComponent } from './entities/globalconfig/globalconfig-line.component';
import { GlobalconfigCompleteComponent } from './entities/globalconfig/globalconfig-auto-complete.component';

import { PackageInfoService } from './entities/packageInfo/packageInfo.service';
import { PackageInfoListComponent } from './entities/packageInfo/packageInfo-list.component';
import { PackageInfoDetailComponent } from './entities/packageInfo/packageInfo-detail.component';
import { PackageInfoLineComponent } from './entities/packageInfo/packageInfo-line.component';
import { PackageInfoCompleteComponent } from './entities/packageInfo/packageInfo-auto-complete.component';

import { PackageTypeService } from './entities/packageType/packageType.service';
import { PackageTypeListComponent } from './entities/packageType/packageType-list.component';
import { PackageTypeDetailComponent } from './entities/packageType/packageType-detail.component';
import { PackageTypeLineComponent } from './entities/packageType/packageType-line.component';
import { PackageTypeCompleteComponent } from './entities/packageType/packageType-auto-complete.component';

import { ReleaseService } from './entities/release/release.service';
import { ReleaseListComponent } from './entities/release/release-list.component';
import { ReleaseDetailComponent } from './entities/release/release-detail.component';
import { ReleaseLineComponent } from './entities/release/release-line.component';
import { ReleaseCompleteComponent } from './entities/release/release-auto-complete.component';

import { ReleaseDataService } from './entities/releaseData/releaseData.service';
import { ReleaseDataListComponent } from './entities/releaseData/releaseData-list.component';
import { ReleaseDataDetailComponent } from './entities/releaseData/releaseData-detail.component';
import { ReleaseDataLineComponent } from './entities/releaseData/releaseData-line.component';
import { ReleaseDataCompleteComponent } from './entities/releaseData/releaseData-auto-complete.component';

import { ReleaseDataTypeService } from './entities/releaseDataType/releaseDataType.service';
import { ReleaseDataTypeListComponent } from './entities/releaseDataType/releaseDataType-list.component';
import { ReleaseDataTypeDetailComponent } from './entities/releaseDataType/releaseDataType-detail.component';
import { ReleaseDataTypeLineComponent } from './entities/releaseDataType/releaseDataType-line.component';
import { ReleaseDataTypeCompleteComponent } from './entities/releaseDataType/releaseDataType-auto-complete.component';

import { ServerService } from './entities/server/server.service';
import { ServerListComponent } from './entities/server/server-list.component';
import { ServerDetailComponent } from './entities/server/server-detail.component';
import { ServerLineComponent } from './entities/server/server-line.component';
import { ServerCompleteComponent } from './entities/server/server-auto-complete.component';

import { ServerConfigService } from './entities/serverConfig/serverConfig.service';
import { ServerConfigListComponent } from './entities/serverConfig/serverConfig-list.component';
import { ServerConfigDetailComponent } from './entities/serverConfig/serverConfig-detail.component';
import { ServerConfigLineComponent } from './entities/serverConfig/serverConfig-line.component';
import { ServerConfigCompleteComponent } from './entities/serverConfig/serverConfig-auto-complete.component';

import { ServerTypeService } from './entities/serverType/serverType.service';
import { ServerTypeListComponent } from './entities/serverType/serverType-list.component';
import { ServerTypeDetailComponent } from './entities/serverType/serverType-detail.component';
import { ServerTypeLineComponent } from './entities/serverType/serverType-line.component';
import { ServerTypeCompleteComponent } from './entities/serverType/serverType-auto-complete.component';

import { RoleService } from './entities/role/role.service';
import { RoleListComponent } from './entities/role/role-list.component';
import { RoleDetailComponent } from './entities/role/role-detail.component';

import { UserService } from './entities/user/user.service';
import { UserListComponent } from './entities/user/user-list.component';
import { UserDetailComponent } from './entities/user/user-detail.component';

import { SolutionComponentService } from './entities/solutionComponent/solutionComponent.service';
import { SolutionComponentListComponent } from './entities/solutionComponent/solutionComponent-list.component';
import { SolutionComponentDetailComponent } from './entities/solutionComponent/solutionComponent-detail.component';
import { SolutionComponentLineComponent } from './entities/solutionComponent/solutionComponent-line.component';
import { SolutionComponentCompleteComponent } from './entities/solutionComponent/solutionComponent-auto-complete.component';

import { ReleaseConfigService } from './entities/releaseConfig/releaseConfig.service';
import { ReleaseConfigListComponent } from './entities/releaseConfig/releaseConfig-list.component';
import { ReleaseConfigDetailComponent } from './entities/releaseConfig/releaseConfig-detail.component';
import { ReleaseConfigLineComponent } from './entities/releaseConfig/releaseConfig-line.component';
import { ReleaseConfigCompleteComponent } from './entities/releaseConfig/releaseConfig-auto-complete.component';

import { Configuration } from './support/configuration';
import { LogoutComponent } from './logout/logout-component';

@NgModule({
    imports: [
// angular
        BrowserModule,
        FormsModule,
        HttpModule,

// primeng
        FileUploadModule,
        PanelModule,
        OverlayPanelModule,
        GrowlModule,
        MenubarModule,
        DialogModule,
        ButtonModule,
        AutoCompleteModule,
        DataTableModule,
        DataListModule,
        SharedModule,
        DropdownModule,
        PickListModule,
        CheckboxModule,
        TriStateCheckboxModule,
        InputTextModule,
        InputTextareaModule,
        CalendarModule,
        PasswordModule,
        TabViewModule,
        InputSwitchModule,
        InplaceModule,
        FieldsetModule,
// our app
        routing
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        EmailValidator
        ,
        ComponentConfigListComponent,
        ComponentConfigDetailComponent,
        ComponentConfigLineComponent,
        ComponentConfigCompleteComponent
        ,
        EnvironmentListComponent,
        EnvironmentDetailComponent,
        EnvironmentLineComponent,
        EnvironmentCompleteComponent,
        SubEnvironmentDetailComponent
        ,
        EnvironmentConfigListComponent,
        EnvironmentConfigDetailComponent,
        EnvironmentConfigLineComponent,
        EnvironmentConfigCompleteComponent
        ,
        GlobalconfigListComponent,
        GlobalconfigDetailComponent,
        GlobalconfigLineComponent,
        GlobalconfigCompleteComponent
        ,
        PackageInfoListComponent,
        PackageInfoDetailComponent,
        PackageInfoLineComponent,
        PackageInfoCompleteComponent
        ,
        PackageTypeListComponent,
        PackageTypeDetailComponent,
        PackageTypeLineComponent,
        PackageTypeCompleteComponent
        ,
        ReleaseListComponent,
        ReleaseDetailComponent,
        ReleaseLineComponent,
        ReleaseCompleteComponent
        ,
        ReleaseDataListComponent,
        ReleaseDataDetailComponent,
        ReleaseDataLineComponent,
        ReleaseDataCompleteComponent
        ,
        ReleaseDataTypeListComponent,
        ReleaseDataTypeDetailComponent,
        ReleaseDataTypeLineComponent,
        ReleaseDataTypeCompleteComponent
        ,
        ServerListComponent,
        ServerDetailComponent,
        ServerLineComponent,
        ServerCompleteComponent
        ,
        ServerConfigListComponent,
        ServerConfigDetailComponent,
        ServerConfigLineComponent,
        ServerConfigCompleteComponent
        ,
        ServerTypeListComponent,
        ServerTypeDetailComponent,
        ServerTypeLineComponent,
        ServerTypeCompleteComponent
        ,
        RoleListComponent,
        RoleDetailComponent
        ,
        UserListComponent,
        UserDetailComponent
        ,
        SolutionComponentListComponent,
        SolutionComponentDetailComponent,
        SolutionComponentLineComponent,
        SolutionComponentCompleteComponent
        ,
        ReleaseConfigListComponent,
        ReleaseConfigDetailComponent,
        ReleaseConfigLineComponent,
        ReleaseConfigCompleteComponent,
        LogoutComponent
    ],
    providers: [
        MessageService
        ,ComponentConfigService
        ,EnvironmentService
        ,EnvironmentConfigService
        ,GlobalconfigService
        ,PackageInfoService
        ,PackageTypeService
        ,ReleaseService
        ,ReleaseDataService
        ,ReleaseDataTypeService
        ,ServerService
        ,ServerConfigService
        ,ServerTypeService
        ,RoleService
        ,UserService
        ,SolutionComponentService
        ,ReleaseConfigService
        ,Configuration
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule {}
