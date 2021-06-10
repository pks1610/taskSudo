import { Component, ElementRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from './shared.service';
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  windowWidth;
  mobileView = true;
  projectData;
  authUserData;
  errorMessage = "";
  selectedVariablesList;
  projectId='2c6196f1-4689-408c-8433-d5d93ae25eb5';
  dropdownSettings;
  dropdownDeviceListSettings;
  // Loader
  showLoader = true;
  showDeviceProfileLoader = true;
  showDevicesLoader = false;
  showVariablesLoader = false;
  showSubmitNotificationLoader=false;


  notificationName='';
  isSelected=true;
  selectedDeviceProfile;
  devices;
  devicesList=[];
  deviceSelect=[];
  // deviceProfileList=["light","energy","street light"]
  deviceProfileList=[]
  deviceProfileVersionId=[];
  deviceProfileListVersion=[]
  variableNameModel=[];
   //set notification
   
   option=[]
  
  options=[];
  devicesListOptions=[];
   

   variableTypeModel=[];
   showSubmitCodecLoader=false;
  
   variableValues2;
   setNotificationLoader=false;
   selectedDeviceIdForSetNotification;

   disableNotificationField=false;
 
   upperThreshold=[]
   upperDelta=[]
   lowerThreshold=[]
   lowerDelta=[]
   contain=[]
   notContain=[]
   equal=[]
   notEqual=[]
   radioButtonSet=[]
   radioButtonReset=[]
   radioButtonCheckedTrue;
   radioButtonCheckedFalse;
  //  form
  variableForm2: FormGroup;
  valueFromDeviceSelect;
  valueFromDeviceProfileSelect;
  notificationSelectForString=["Contains","Not Contains","Equals","Not Equals"]
  deviceData;
  queryDeviceId;
  queryDeviceProfileVersionId;

  constructor( private fb:FormBuilder,
    private sharedService: SharedService,
    private toastr: ToastrService,
    private elem: ElementRef,
    private router:Router) { 
      // this.projectId = ;
  
    this.windowWidth = $(window).width();
    if (this.windowWidth <= 480) {
      this.mobileView = true;
    } else {
      this.mobileView = false;
    }
  
    this.sharedService.getAprovedDeviceProfileNotification({
      createdBy: 'faiz@cubical.in',
      projectId:this.projectId
    }).subscribe(data=>{
      for (let i = 0; i < data['data'].length; i++) {
        // this.deviceProfileList.push(data.data[i].deviceProfile.deviceProfileName)
        this.deviceProfileList.push(data.data[i])
    // For pre-filling select tag while coming from DEVICE DETAIL
        if(i==data['data'].length-1){

          if (this.queryDeviceProfileVersionId) {
            confirm("working fine")
            this.selectedDeviceProfile = this.queryDeviceProfileVersionId
            let event = { target: { value: this.selectedDeviceProfile } }
            this.selectDeviceProfile(event)
           

          }
        }
      }
    
      this.showDeviceProfileLoader = false;
     
    },(error)=>{
      console.log(error)
      this.toastr.error('Error! Device profiles could not be loaded.', '');
      this.showDeviceProfileLoader = false;
    })


    this.getProjectDetails();
        // SET NOTIFICATIONS
        this.variableForm2 = this.fb.group({
          variables2: this.fb.array([
            
          ]) ,
        });
        this.dropdownSettings = {
          singleSelection: false,
          idField: 'key',
          textField: 'key',
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          itemsShowLimit: 6,
          allowSearchFilter: true,
        };
        
        this.dropdownDeviceListSettings = {
          singleSelection: false,
          idField: 'key',
          textField: "deviceName",
          // textField: 'deviceName'+''+'assetName',
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          itemsShowLimit: 6,
          allowSearchFilter: true,
          searchPlaceholderText:"Search via deveui,asset",
          maxHeight:300
        };
        
console.log("selectedDeviceProfile=",this.selectedDeviceProfile)
}
getProjectDetails() {

  let projectID =' 2c6196f1-4689-408c-8433-d5d93ae25eb5'
  this.sharedService.getProject(projectID).subscribe(
    (data) => {
      this.projectData = data.data[0];
      this.showLoader = false;

      // Enter code here
    },
    (error) => {
      console.log(error);
      this.showLoader = false;
      this.errorMessage = "Something went wrong, Please try again!";
    }
  );
}

numericOnly(event,type): boolean {
  console.log(type)
  let intPatt = /^([0-9])$/;
  let floatPatt=/^([0-99])$/;
  let booleanPatt=/^([0-1])$/;
  if(type=='int'){
 
    let result = intPatt.test(event.key);
    return result;
  }
  if(type=='float'){
 }
  if(type=='boolean'){
    let result = booleanPatt.test(event.key);
    return result;
  }
}

variablesEdit() : FormArray {
return this.variableForm2.get("variables2") as FormArray
}

variables2() : FormArray {
return this.variableForm2.get("variables2") as FormArray
}

newVariable2(): FormGroup {
  return this.fb.group({
    upperThresholdValue: '',
    upperDeltaValue:'',
    lowerThresholdValue: '',
    lowerDeltaValue: '',
    
  })
}

formAdd(name, model){
this.variables2().push(this.fb.group({
  upperThresholdValue:'',
  upperDeltaValue: '',
  lowerThresholdValue: '',
  lowerDeltaValue: '',
  radioButtonSet:'',
  radioButtonReset:'',
  
  selectSet:'',
  selectReset:'',
  valueSet:'',
  valueReset:'',
  variableTypeModel: model,
  variableNameModel: name


})) 
}
removeVariableForm(i: number){
  this.variables2().removeAt(i)
}

onItemSelectFromDevice(event){
console.log(this.deviceSelect)
}
onItemSelectFromVariable(event){
console.log(event)
this.addVariableFormFromSelectValue();
}
onSelectAllFromVariable(event){
this.devices=event;

this.addVariableFormFromSelectValue();
}

selectAllVariables(event){
console.log(event)
}
selectAllDevices(event) {
let elements = this.elem.nativeElement.querySelectorAll(
  "input.list-checkbox"
);
if (event.target.checked) {
  elements.forEach((element) => {
    this.selectedVariablesList.push(element.getAttribute("value"));
    console.log(this.selectedVariablesList)

    console.log($(element).data("device-profile"));
    element.setAttribute("checked", "checked");
  });
} else {
  this.selectedVariablesList = [];

  elements.forEach((element) => {
    element.removeAttribute("checked");
  });
  console.log(this.selectedVariablesList)
}
}








selectDeviceProfile(event){
this.showDevicesLoader = true;
this.showVariablesLoader = true;
this.valueFromDeviceProfileSelect = event.target.value;
console.log(event.target.value)

let devicesOption=[];

this.sharedService.getAllDevicesNotification({
  projectId:this.projectId,
  deviceProfileVersionId:event.target.value
}).subscribe(data=>{
  console.log("get All devices",data.data)
  devicesOption=[];
  for (let i = 0; i < data.data.length; i++) {
         this.devicesList.push(data.data[i])
        //  this.devicesListOptions.push({key:data.data[i].deviceId})
      
        devicesOption.push({key:data.data[i].deviceId,deviceName:data.data[i].assetName?data.data[i].deveui + ' ( ' +data.data[i].assetName+' )':data.data[i].deveui + ' ( - )',assetName:data.data[i].assetName})

        
// for pre filling in devicec when coming from device detail page
        let deviceSelectForQueryParam=[]
        if(data.data[i].deviceId==this.queryDeviceId){
         alert("Device id from query="+this.queryDeviceId)
         deviceSelectForQueryParam.push({key:data.data[i].deviceId,deviceName:data.data[i].assetName?data.data[i].deveui + ' ( ' +data.data[i].assetName+' )':data.data[i].deveui + ' ( - )',assetName:data.data[i].assetName})
        this.deviceSelect=deviceSelectForQueryParam
        }
      
  }

        this.devicesListOptions=devicesOption;
        console.log(this.devicesListOptions)
        console.log(this.devicesList)  
        this.showDevicesLoader = false;    

},(error)=>{
  console.log(error)
  this.toastr.error('Error! Devices could not be loaded.', '');
  this.showDevicesLoader = false;
})


// codel model will get the variables

this.sharedService.getCodecModel({ deviceProfileVersionId:event.target.value })
  .subscribe(data => {
 
    var newData = JSON.stringify(data)
    var getData=JSON.parse(newData)
    
    let dataForOption=[]
    let dataForOptions=[]
    
    for (const [key,value] of Object.entries(getData.data)) {
      
      dataForOption.push({[key]:value})
      dataForOptions.push({key:key})
      
    }
    this.option=dataForOption;
    this.options=dataForOptions;
    
 
    this.showVariablesLoader = false;
  },(error)=>{
    console.log(error)
    this.toastr.error('Error! Variables could not be loaded.', '');
    this.showVariablesLoader = false;
  })
  console.log(this.notificationName);
  
}
addVariableFormFromSelectValue(){

this.variableNameModel=[];
this.variableTypeModel=[];

for (let i = this.variablesEdit().controls.length-1; i >= 0; i--) {

  this.variablesEdit().removeAt(i);
}
let valueFromNgDeviceSelect=[]
for (let i = 0; i < this.devices.length; i++) {
  valueFromNgDeviceSelect.push(this.devices[i])
}
let keys=Object.keys(this.option)
let values= Object.values(this.option)



console.log(this.devices[0].key)
for (let i = 0; i < this.devices.length; i++) {


   
   for (let j = 0; j < values.length; j++) {
 
   if(this.devices[i].key==Object.keys(values[j])[0]){

     this.formAdd(Object.keys(this.option[j])[0], Object.values(this.option[j])[0])
     this.variableNameModel.push(Object.keys(this.option[j])[0])
     this.variableTypeModel.push(Object.values(this.option[j])[0])
     
   }
  }
 }
}


onSubmitVariable2(){
this.showSubmitNotificationLoader=true;
console.log("devices select=",this.deviceSelect)
// if length of selected is 0 then deviceSelect will == undefined and a application will not proceed
if(this.deviceSelect == undefined){
  this.toastr.error("Please select atleast one device to proceed..!")
  this.showSubmitNotificationLoader=false
}

let deviceSelectedFromSelect=[];
for (let i = 0; i < this.deviceSelect.length; i++) {
  deviceSelectedFromSelect.push(this.deviceSelect[i].key)
}

console.log("postdata ",deviceSelectedFromSelect)
// let postData={}
let postData={
  notificationDescription:this.notificationName,
  deviceIds: deviceSelectedFromSelect,
  userEmail: 'faiz@cubical.in',
  projectId:this.projectId,
  variableName:{}
}

this.variableValues2=this.variableForm2.value





var lengthOfVariableForm2=this.variableValues2.variables2.length
console.log(lengthOfVariableForm2)
for (let i = 0; i < lengthOfVariableForm2; i++) {
  console.log(i)
  console.log(this.variableValues2.variables2[i]) 
  console.log(this.variableValues2.variables2[i].upperThresholdValue)
  
console.log(this.variableNameModel[i]) 
console.log(this.variableNameModel.length) 

  // this.variableNameModel[i]=[];
  this.upperThreshold[i] = [];
  this.upperDelta[i] = []
  this.lowerThreshold[i] = []
  this.lowerDelta[i] = []
  this.contain[i] = []
  this.notContain[i] = []
  this.equal[i] = []
  this.notEqual[i] = []
  this.radioButtonSet[i]=[]
  this.radioButtonReset[i]=[]

postData.variableName[this.variableNameModel[i]]={
  "type":this.variableTypeModel[i],
  "upperThreshold": this.variableValues2.variables2[i].upperThresholdValue,
  "upperDelta": this.variableValues2.variables2[i].upperDeltaValue,
  "lowerThreshold": this.variableValues2.variables2[i].lowerThresholdValue,
  "lowerDelta": this.variableValues2.variables2[i].lowerDeltaValue,
  
  "selectSet":this.variableValues2.variables2[i].selectSet,
  "valueSet":this.variableValues2.variables2[i].valueSet,
  "selectReset":this.variableValues2.variables2[i].selectReset,
  "valueReset":this.variableValues2.variables2[i].valueReset,
  
  "radioButtonSet":this.variableValues2.variables2[i].radioButtonSet, 
  "radioButtonReset":(!this.variableValues2.variables2[i].radioButtonSet).toString()  
}
}
console.log(postData)
// api call for post
   this.sharedService.createNotifications(postData).subscribe(data=>{
    this.showSubmitNotificationLoader=false;
  
    console.log(data)
    console.log("DATA POSTED")
    this.toastr.success('Notification set for Device Profile  : ',this.selectedDeviceProfile);
    this.goToNotificationRuleList();
  },(error)=>{
    console.log(error)
    this.toastr.error('Error! Unable to set notification.', '');
    this.showSubmitNotificationLoader=false;
  })

}
goToNotificationRuleList() {
  this.toastr.success("Submit successful")
  // refresh the page 
  window.location.reload();
// this.router.navigate(['/', 'admin', 'notification-list',this.projectId]);
}

radioCheckInSetForTrue(event) {
  this.radioButtonCheckedTrue = event.target.checked
  console.log("for true radio button", this.radioButtonCheckedTrue)
  this.radioButtonCheckedFalse = false;
}
radioCheckInSetForFalse(event) {
  this.radioButtonCheckedFalse = event.target.checked
  console.log("for false radio button", this.radioButtonCheckedFalse)
  this.radioButtonCheckedTrue = false;
}





}
