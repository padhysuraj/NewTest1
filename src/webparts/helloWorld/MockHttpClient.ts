import { ISPList } from './ISPList';

export default class MockHttpClient{
    
    private static _items : ISPList[]=[
        { Id: "1", Title:"Suraj" },
        { Id: "2", Title:"Sudeep" },
        { Id: "3", Title:"Bawa" },
        { Id: "4", Title:"Sid" },
        { Id: "5", Title:"Sachin" },
        { Id: "6", Title:"Karan" }
    ];
    
    public static get(restUrl:string, options?:any):Promise<ISPList[]>{
        return new Promise<ISPList[]>((resolve)=>{
            resolve(MockHttpClient._items);
        });
    }
}