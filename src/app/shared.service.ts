import { Injectable } from '@angular/core';
import {  HttpHeaders, HttpParams } from "@angular/common/http";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private http: HttpClient) {}
  getParams(args = {}) {
    let params = new HttpParams();
    Object.keys(args).forEach((element) => {
      if (args[element]) {
        params = params.append(element, args[element]);
      }
    });
    return params;
  }
  
  getProject(id): Observable<any> {
    const url = `https://f4pfxt1jn2.execute-api.ap-south-1.amazonaws.com/testdcp/projects/v1/GetProjectDetails/${id}`;
    return this.http.get(url);
  }
  getCodecModel(paramData = {}) {
    let params = this.getParams(paramData);
    const url = `https://f4pfxt1jn2.execute-api.ap-south-1.amazonaws.com/testdcp/codec/v1/GetCodecModel`;
    return this.http.get(url, { params })
  }
  createNotifications(postData,paramData = {}): Observable<any>{
    let params = this.getParams(paramData);
    const url=`https://f4pfxt1jn2.execute-api.ap-south-1.amazonaws.com/testdcp/devices/v1/CreateNotification`;
    return this.http.post(url, postData, { params });
  }
  getAprovedDeviceProfileNotification(paramData = {}): Observable<any> {
    let params = this.getParams(paramData);
    const url=`https://f4pfxt1jn2.execute-api.ap-south-1.amazonaws.com/testdcp/deviceprofiles/v1/GetApprovedDeviceProfile`
    return this.http.get(url, { params })
  }  
  getAllDevicesNotification(paramData = {}): Observable<any> {
    let params = this.getParams(paramData);
    const url=`https://f4pfxt1jn2.execute-api.ap-south-1.amazonaws.com/testdcp/devices/v1/GetAllDevices`
    return this.http.get(url, { params })
  }
}
