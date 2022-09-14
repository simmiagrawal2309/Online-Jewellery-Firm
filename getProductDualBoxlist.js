import { LightningElement, track } from 'lwc';
import getProductRecords from '@salesforce/apex/GetProductsDualClass.getProductRecords';
import getorderItems from '@salesforce/apex/GetProductsDualClass.getorderItems';
import sendOrderInfo from '@salesforce/apex/GetProductsDualClass.sendOrderInfo';
import Object_Name from '@salesforce/schema/OrderInfo__c';
import Billing_Address from '@salesforce/schema/OrderInfo__c.Billing_Address__c';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class GetProductDualBoxlist extends LightningElement {
    objectApiName = Object_Name;
    BillingAddress = Billing_Address;
    productList = [];
    orderinfoList = [];
    @track ProdName=[];
    @track orderInformationlist = [];
    _selected = [];
    selectedValues;
    @track xyz = false;
    @track options = [

    ];
    @track selectedu;
    bigList = [];
    smallList = [];
    // @track orderu;
    // @track accountinfou;
    // @track billingAddu;

    handleExtraRow(event) {
        // console.log('Key -->>>> ', event.currentTarget.dataset);
        // console.log('*string -->>>> ', JSON.stringify(event.currentTarget.dataset)); //
        var forOrderId=event.currentTarget.dataset.id;
        console.log('*string id-->>>> ', JSON.stringify(forOrderId));
        // console.log('details -->> ', event.detail.dataset.OrderIDD);
        this.xyz = !this.xyz;
        console.log('data>>>>',event);
        console.log('data target>>>>',event.target.value);
        // getorderItems({ pList: this.productList, ordId: orderid });

        sendOrderInfo({orderId: forOrderId})
         .then(response=>{
            var blankVariable;
            console.log('response is', JSON.stringify(response));
            for(var i=0;i<response.length;i++){
                var pName= response[i].Product__r.Name;
                console.log('Pname is----', pName);
                // blankVariable.push({ProductNames: JSON.stringify(pName)});
                // console.log('this.ProdName',blankVariable);
            }
            // this.ProdName.pushAll(blankVariable);
            // console.log(' this.ProdName---', this.ProdName);
         })
         .catch(error=>{
            console.log('error is', JSON.stringify(error));
         })
        //  this.ProdName.pushAll({ProductInfo:blankVariable});
        //  console.log(' this.ProdName---', this.ProdName);
    }
    connectedCallback() {
        getProductRecords()
            .then(response => {
                console.log('products response:', JSON.stringify(response));
                var temp = JSON.parse(JSON.stringify(response)); //bs cloning hi hui h ek tarah
                //  this.productList=temp;
                console.log('temp response with JSON.parse', JSON.stringify(temp));
                for (var i = 0; i < temp.length; i++) {
                    var ProductName = temp[i].Name; //productsName aagye
                    console.log('newResponse is:', ProductName);
                    var ProductIds = temp[i].Id;
                    console.log('ProductIds', ProductIds);
                    this.options.push({ label: ProductName, value: ProductName });
                    // console.log('pus',this.options.push({ label: ProductName, value: ProductName }));
                    //   console.log('list: ',this.options[i]);                                        
                    //   console.log('this.options is',this.options);
                    //this.selectedValues=ProductName;
                    //   console.log('selected values are:',  this.selectedValues );
                }
            })
            .catch(error => {
                console.log('error occoured', JSON.stringify(error));
            })
    }
    get selected() {
        return this._selected.length ? this._selected : 'none';
    }

    handleChange(event) {
        this._selected = event.detail.value;
        // console.log('xcvbnm',event);
        // console.log('defe',JSON.stringify(event.detail));
        // console.log('event.detail.value', JSON.stringify(event.detail.value));
        console.log(' this._selected ', JSON.stringify(this._selected));
        this.selectedu = this._selected;
        console.log('selectedProduct', JSON.stringify(this.selectedu));

    }
    @track isModalOpen = false;
    @track isOrderSave = false;
    openModal() {
        // to open modal set isModalOpen tarck value as true
        this.isModalOpen = true;
    }
    closeModal() {
        // to close modal set isModalOpen tarck value as false
        this.isModalOpen = false;


    }
    submitDetails() {
        // to close modal set isModalOpen tarck value as false
        //Add your code to call apex method or do some processing
        this.isModalOpen = false;
        //  this.template.querySelector('lightning-record-edit-form').submitDetails();
    }

    handleSuccess(event) {

        console.log('onsuccess event recordEditForm', event.detail.id);  // order ki id  a025i000006ivDDAAY
        console.log('eventtrr products are h kya lets check', JSON.stringify(event.detail));

        var orderid = event.detail.id;
        var billingAdd = event.detail.fields.Billing_Address__c.value;
        var AccountInfo = event.detail.fields.Account__r.displayValue;
        var product1 = this.selectedu;
        let smallvar=[];
        let bigvar=[];
        console.log('product bhi aaya kya', JSON.stringify(product1));
        //var ShippingAdd=event.detail.fields.
        console.log('orderid', orderid);
        console.log('baddres id', billingAdd);
        console.log('Accinfo', AccountInfo);
        this.orderinfoList.push({ OrderIDD: orderid, BillingAddress: billingAdd, AccoutName: AccountInfo });
        console.log('this.orderinfoList', JSON.stringify(this.orderinfoList));

        //this.orderinfoList [{"OrderIDD":"a025i000006j6FvAAI","BillingAddress":"ollll","AccoutName":"Tqfghest11221AccountTrigger"}]
        this.orderInformationlist = this.orderinfoList;
        console.log('this.orderInformationlist ', JSON.stringify(this.orderInformationlist));

        smallvar.push({ OrderIDD: orderid, BillingAddress: billingAdd, AccoutName: AccountInfo, ProductName: product1 });
        console.log('this.smallList ka data ', JSON.stringify(smallvar));
        // this.bigvar.push({});
        smallvar.push(...bigvar);
        console.log('big var', JSON.stringify(smallvar) );
        console.log('smallvar', smallvar);
        // this.bigList.push({});
        // this.orderu= orderid;
        // this.accountinfou=AccountInfo;
        // this.billingAddu=billingAdd;  

        // console.log(' this.orderu', this.orderu);

        const events = new ShowToastEvent({
            title: "Successful",
            message: "Order Saved",
            variant: 'success'
        })
        this.dispatchEvent(events);
        for (let i = 0; i < this._selected.length; i++) {
            var prrName = this.template.querySelectorAll(".prname")[i].outerText;
            console.log('prrName', prrName);
            var qua = this.template.querySelectorAll(".num")[i].value;
            console.log('qua', qua);
            // console.log('Product: '+this.template.querySelectorAll(".prname")[i].outerText);
            // console.log('Quantities: '+ this.template.querySelectorAll(".num")[i].value);
            this.productList.push({ Product: prrName, Quantity: qua });

        }
        console.log('this.productList', this.productList);
        // var n=this.template.querySelectorAll(".prname").forEach(v=>{console.log('v',v.outerText)}); //productName
        // console.log('n',n); //proxy-prname[0].outerText
        // var p=this.template.querySelectorAll(".num").forEach(k=>{console.log('k',k.value)});
        // console.log('p',p);

        getorderItems({ pList: this.productList, ordId: orderid });
        this.isOrderSave = true;
        //submitDetails();
        this.isModalOpen = false;
    }
    handleSubmit(event) {
        console.log('onsubmit event recordEditForm' + JSON.stringify(event.detail.fields));  //[object objcet]
        // onsubmit event recordEditForm{"Account__c":null,"Billing_Address__c":",mnb","Shipping_Address__c":null,"Person_Email_Order_placed_by__c":null}

        // getorderItems({prodName: this._selected})
        //  submitDetails();
    }
}