import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';

import { ComponentConfigListComponent } from './entities/componentConfig/componentConfig-list.component';
import { ComponentConfigDetailComponent } from './entities/componentConfig/componentConfig-detail.component';

import { EnvironmentListComponent } from './entities/environment/environment-list.component';
import { EnvironmentDetailComponent } from './entities/environment/environment-detail.component';
import { SubEnvironmentDetailComponent } from './entities/environment/subEnvironment-detail.component';

import { SubEnvironmentConfigListComponent } from './entities/environmentConfig/subEnvironmentConfig-list.component';
import { SubEnvironmentConfigDetailComponent } from './entities/environmentConfig/subEnvironmentConfig-detail.component';

import { GlobalconfigListComponent } from './entities/globalconfig/globalconfig-list.component';
import { GlobalconfigDetailComponent } from './entities/globalconfig/globalconfig-detail.component';

import { PackageInfoListComponent } from './entities/packageInfo/packageInfo-list.component';
import { PackageInfoDetailComponent } from './entities/packageInfo/packageInfo-detail.component';

import { PackageTypeListComponent } from './entities/packageType/packageType-list.component';
import { PackageTypeDetailComponent } from './entities/packageType/packageType-detail.component';

import { ReleaseListComponent } from './entities/release/release-list.component';
import { ReleaseDetailComponent } from './entities/release/release-detail.component';

import { ReleaseDataListComponent } from './entities/releaseData/releaseData-list.component';
import { ReleaseDataDetailComponent } from './entities/releaseData/releaseData-detail.component';

import { ReleaseDataTypeListComponent } from './entities/releaseDataType/releaseDataType-list.component';
import { ReleaseDataTypeDetailComponent } from './entities/releaseDataType/releaseDataType-detail.component';

import { ServerListComponent } from './entities/server/server-list.component';
import { ServerDetailComponent } from './entities/server/server-detail.component';

import { ServerConfigListComponent } from './entities/serverConfig/serverConfig-list.component';
import { ServerConfigDetailComponent } from './entities/serverConfig/serverConfig-detail.component';

import { ServerTypeListComponent } from './entities/serverType/serverType-list.component';
import { ServerTypeDetailComponent } from './entities/serverType/serverType-detail.component';

import { RoleListComponent } from './entities/role/role-list.component';
import { RoleDetailComponent } from './entities/role/role-detail.component';

import { UserListComponent } from './entities/user/user-list.component';
import { UserDetailComponent } from './entities/user/user-detail.component';

import { SolutionComponentListComponent } from './entities/solutionComponent/solutionComponent-list.component';
import { SolutionComponentDetailComponent } from './entities/solutionComponent/solutionComponent-detail.component';

import { ReleaseConfigListComponent } from './entities/releaseConfig/releaseConfig-list.component';
import { ReleaseConfigDetailComponent } from './entities/releaseConfig/releaseConfig-detail.component';
import { LogoutComponent } from './logout/logout-component';

export const routes: Routes = [
    { path : '',  component: HomeComponent }
    ,
    {path: 'componentConfig-list', component: ComponentConfigListComponent },
    {path: 'componentConfig/:id', component: ComponentConfigDetailComponent }
    ,
    {path: 'environment-list', component: EnvironmentListComponent },
    {path: 'environment/:id', component: EnvironmentDetailComponent },
    {path: 'subEnv/:id', component: SubEnvironmentDetailComponent },
    {path: 'subEnv/:id/:envId', component: SubEnvironmentDetailComponent }
    ,
    {path: 'subEnvironmentConfig-list', component: SubEnvironmentConfigListComponent },
    {path: 'subEnvironmentConfig/:id', component: SubEnvironmentConfigDetailComponent }
    ,
    {path: 'globalconfig-list', component: GlobalconfigListComponent },
    {path: 'globalconfig/:id', component: GlobalconfigDetailComponent }
    ,
    {path: 'packageInfo-list', component: PackageInfoListComponent },
    {path: 'packageInfo/:id', component: PackageInfoDetailComponent }
    ,
    {path: 'packageType-list', component: PackageTypeListComponent },
    {path: 'packageType/:id', component: PackageTypeDetailComponent }
    ,
    {path: 'release-list', component: ReleaseListComponent },
    {path: 'release/:id', component: ReleaseDetailComponent }
    ,
    {path: 'releaseData-list', component: ReleaseDataListComponent },
    {path: 'releaseData/:id', component: ReleaseDataDetailComponent }
    ,
    {path: 'releaseDataType-list', component: ReleaseDataTypeListComponent },
    {path: 'releaseDataType/:id', component: ReleaseDataTypeDetailComponent }
    ,
    {path: 'server-list', component: ServerListComponent },
    {path: 'server/:id', component: ServerDetailComponent }
    ,
    {path: 'serverConfig-list', component: ServerConfigListComponent },
    {path: 'serverConfig/:id', component: ServerConfigDetailComponent }
    ,
    {path: 'serverType-list', component: ServerTypeListComponent },
    {path: 'serverType/:id', component: ServerTypeDetailComponent }
    ,
    {path: 'role-list', component: RoleListComponent },
    {path: 'role/:id', component: RoleDetailComponent }
    ,
    {path: 'user-list', component: UserListComponent },
    {path: 'user/:id', component: UserDetailComponent }
    ,
    {path: 'solutionComponent-list', component: SolutionComponentListComponent },
    {path: 'solutionComponent/:id', component: SolutionComponentDetailComponent }
    ,
    {path: 'releaseConfig-list', component: ReleaseConfigListComponent },
    {path: 'releaseConfig/:id', component: ReleaseConfigDetailComponent }
    ,
    {path: 'logout', component: LogoutComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
