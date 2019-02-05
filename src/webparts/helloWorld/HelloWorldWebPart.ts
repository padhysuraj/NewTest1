import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version, Environment, EnvironmentType,  } from '@microsoft/sp-core-library';
import { SPHttpClient } from '@microsoft/sp-http';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneCheckbox,
  PropertyPaneDropdown,
  PropertyPaneToggle
} from '@microsoft/sp-webpart-base';

import * as strings from 'HelloWorldWebPartStrings';
import HelloWorld from './components/HelloWorld';
import { IHelloWorldProps } from './components/IHelloWorldProps';

import {ISPList} from './ISPList';
import MockHttpClient from './MockHttpClient';

export interface IHelloWorldWebPartProps {
  description: string;
  text1:string;
  dropdown:string;
  checkbox:boolean;
  toggle:boolean;
  newgrouptextfield:string;
  page2group1textfield:string;
  page2group2textfield:string;
}

export default class HelloWorldWebPart extends BaseClientSideWebPart<IHelloWorldWebPartProps> {

  public render(): void {
    this._getListData().then(lists => {
    const element: React.ReactElement<IHelloWorldProps> = React.createElement(
      HelloWorld,
      {
        description: this.properties.description,
        lists:lists
      }
    );
    ReactDom.render(element, this.domElement);
  });
}

private _getListData():Promise<ISPList[]>{
  if(Environment.type === EnvironmentType.Local){
    return this._getMockListData();
  }
  else{
    return this._getSPListData();
  }
}

  private _getMockListData():Promise<ISPList[]>{
    return MockHttpClient.get(this.context.pageContext.web.absoluteUrl)
    .then((data:ISPList[])=>{
      return data;
    });
  }

  private _getSPListData():Promise<ISPList[]>{
    const url:string=this.context.pageContext.web.absoluteUrl + `/_api/web/lists?$filter=Hidden eq false`;

    return this.context.spHttpClient.get(url,SPHttpClient.configurations.v1)
    .then(response => { 
      return response.json(); 
    })
    .then(json => { 
      return json.value;
       }) as Promise<ISPList[]>;
  }

  protected get disableReactivePropertyChanges(): boolean {
    return true;
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneTextField('text1',{
                  label:'text1Label',
                  multiline:true
                }),
                PropertyPaneToggle('toggle',{
                  label:"Toggle description",
                  onText:"Yo",
                  offText:"Na"
                }),
                PropertyPaneCheckbox('checkbox',{
                  text:"checkboxText",
                  checked:true
                }),
                PropertyPaneDropdown('dropdown',{
                  label:"toggle description",
                  options:[
                    {key:'1',text:'value1'},
                    {key:'2',text:'value2'},
                    {key:'3',text:'value3'}
                  ]
                })
              ]
            },
            {
              groupName:"New Group Page 1",
              groupFields:[
                PropertyPaneTextField("newgrouptextfield",{
                  label:"New Text field description"
                })
              ]
            }
          ]
        },
        {
          header:{ 
            description: "New Page"
          },
          groups:[
            {
              groupName:"Page 2 Group 1",
              groupFields:[
                PropertyPaneTextField('page2group1textfield', {
                  label: "page2group1textfield"
                })
              ]
            },
            {
              groupName:"Page 2 Group 2",
              groupFields:[
                PropertyPaneTextField('page2group2textfield', {
                  label: "page2group1textfield"
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
