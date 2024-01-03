import Mura from 'mura.js';
import React, {useEffect} from 'react';
import { createRoot } from 'react-dom/client';
import {getMura as getMuraInstance,setMuraConfig } from '@murasoftware/next-core';


class Builder {
    constructor(muraConfig) {
        this.connectorConfig=muraConfig;
        this.jsonConfig = {
            "global":{
                "rendererProperties":{
                    "templateArray":["default"],
                    "collectionLayoutArray":[],
                    "collectionDefaultLayout":"List",
                    "SSR":false,
                    "hashurls":false,
                    "primaryContentTypes":"Page,Link,File",
                    "editableAttributesArray":[],
                    "imageAttributesArray":[],
                    "defaultInheritedRegions":["header","footer"],
                    "layoutOptions":[],
                    "spacingOptions":[],
                    "moduleThemeOptions":[]
                },
                "modules":{}
            },
            "sites":{
                "default":{
                    "rendererProperties":{
        
                    },
                    "modules":{
        
                    }
                }
            }
        };

        this.moduleRegistry = [];
        this.externalLookup = {};
        this.moduleClientMap = {};
    }
    
    getMura(context){
      setMuraConfig(this.getJSConfig());
      const MuraInstance=getMuraInstance(context);
      MuraInstance.Module=this.moduleClientMap;
      return MuraInstance
    }
    
    async registerLib(ModuleLibrary,siteid) {
       /*
        example ModuleLibrary:
          {
            rendererProperties:{
              spacingOptions:[],
              moduleThemeOptions:[],
              layoutOptions:[]
            },
            moduleRegistry:[ 
              '@murasoftware/mylib/mymodule1',
              '@murasoftware/mylib/mymodule2',
              '@murasoftware/mylib/mymodule3',
            ]
          }
        */
    
        const rendererProperties=((siteid) ? this.getJSONConfig(siteid) : this.jsonConfig.global).rendererProperties;
        
        const libRendererProps=Object.assign({},ModuleLibrary.rendererProperties);
        
        delete libRendererProps.spacingOptions;
        delete libRendererProps.moduleThemeOptions;
        delete libRendererProps.layoutOptions;

        Object.assign(rendererProperties,libRendererProps)

        if(ModuleLibrary.rendererProperties.spacingOptions){
          ModuleLibrary.rendererProperties.spacingOptions.forEach((style) => {
            rendererProperties.spacingOptions.push(style);
          });
        }

        if(ModuleLibrary.rendererProperties.moduleThemeOptions.length){
          ModuleLibrary.rendererProperties.moduleThemeOptions.forEach((style) => {
            rendererProperties.moduleThemeOptions.push(style);
          });
        }

        if(ModuleLibrary.rendererProperties.layoutOptions.length){
          ModuleLibrary.rendererProperties.layoutOptions.forEach((style) => {
            rendererProperties.layoutOptions.push(style);
          });
        }
 
        if(ModuleLibrary.moduleRegistry.length){
          await this.registerModules(ModuleLibrary.moduleRegistry,siteid);
        }

        return this;
    }

    async registerModules(paths,siteid) {
        for (const module of paths) {
          await this.registerModule(module,siteid);
       }
    }

    async registerModule(incomingModule,siteid) {

        /*
        example ModuleConfig:
          {
            name: 'CollectionLayout',
            component: CollectionLayout,
            getQueryProps: fn,
            getDynamicProps: fn,
            excludeFromClient: true,
            configurator: {...},
            isCollectionLayout: true,
          }
        */
        const module={};

        Object.assign(module,incomingModule);
        
        const config=(siteid) ? this.getJSONConfig(siteid) : this.jsonConfig.global;
        
        config.rendererProperties.collectionLayoutArray=config.rendererProperties.collectionLayoutArray || [];
      
        module.getQueryProps=module.getQueryProps || function(){};
        module.getDynamicProps=module.getDynamicProps || function(){};
        module.key=module.key || module.name;

        if(typeof module.contenttypes == 'undefined'){
          module.contenttypes="*";
        }
        if(typeof module.isCollectionLayout == 'undefined'){
          module.isCollectionLayout=false;
        }
        if(typeof module.excludeFromClient == 'undefined'){
          module.excludeFromClient=false;
        }
        if(typeof module.SSR == 'undefined'){
          module.SSR=true;
        }

        if(module.isCollectionLayout && !config.rendererProperties.collectionLayoutArray.find((layout) => layout.name == module.name)){
          config.rendererProperties.collectionLayoutArray.push(module.key);
        }

        this.moduleRegistry.push(module);
       
        const jsonModule=Object.assign({},module);
      
        delete jsonModule.component;
        delete jsonModule.getDynamicProps
        delete jsonModule.getQueryProps
        config.modules[jsonModule.key]=jsonModule;
        
        return this;
    }

    generateModuleLookup() {
        const moduleLookup={};
        //console.log(this.moduleRegistry)
        this.moduleRegistry.forEach(module => {
            if(typeof module.component == 'undefined'){
              this.externalLookup[module.name]=module;
            } else {
              if(typeof module.SSR == 'undefined' && typeof module.ssr == 'undefined'){
                module.SSR=true;
              }
              module.getDynamicProps =
                module.getDynamicProps ||
                function() {
                  return {};
                };
              module.getQueryProps =
                module.getQueryProps ||
                function() {
                  return {fields:''};
                };
              moduleLookup[module.key] = {
                component: module.component,
                getDynamicProps: module.getDynamicProps,
                getQueryProps: module.getQueryProps,
                SSR:module.SSR
              };
              if (!module.excludeFromClient) {
               this.moduleClientMap[module.key] = Mura.UI.extend({
                  component: module.component,
                  clientRendered: false,
                  renderClient() {
                    const content = Mura.content.getAll();
                    const Component = this.component;
                    const props = {...this.context,content};
                    const self = this;
          
                    function ModuleWithCallbackAfterRender(props) {
                      useEffect(() => {
                        self.trigger('afterRender');
                      });
                      return  <Component {...props}/>
                    }
                    
                    if(this.root){
                      this.root.unmount();
                    }
          
                    this.root=createRoot(this.context.targetEl);
          
                    this.root.render(
                      <ModuleWithCallbackAfterRender {...props}/>
                    );
          
                    this.clientRendered=true;
                  },
                  destroy(){
                    if( this.clientRendered
                        && this.context 
                        && this.context.targetEl 
                        && this.context.targetEl.innerHTML){
                          this.root.unmount();
                    }
                  }
                });
              }
            }
        });
      
        this.applyModuleShims();

        return moduleLookup;
    }

    //These exist because there are vanilla version in Mura.js istelf that need react specific tweaks
    applyModuleShims(){
      //console.log(this.moduleLookup)
       this.moduleClientMap.Container.reopen({
            reset(self, empty) {
            if(empty){
              self.find('.mura-object:not([data-object="container"])').html('');
              self.find('.frontEndToolsModal').remove();
              self.find('.mura-object-meta').html('');
            }
              const content = self.children('div.mura-object-content');
            if(content.length){
              const kids=content.children('.mura-object');
        
              if(kids.length){
                  const nestedObjects = [];
                  kids.each(function() {
                    Mura.resetAsyncObject(this, true);
                    const item=Mura(this).data();
                    delete item.inited;
                    nestedObjects.push(item);
                  });
                  self.data('items', JSON.stringify(nestedObjects));
              }
              }
          }
        });
       
       this.moduleClientMap.GatedAsset.reopen({
            reset(self, empty) {
              self.find('.frontEndToolsModal').remove();
              self.find('.mura-object-meta').html('');
          
              var gate = self.find('.mura-gate > div.mura-object');
          
              if (gate.length) {
              Mura.resetAsyncObject(gate.node, empty);
              const gateparams=gate.data();
              delete gateparams.inited;
              self.data('gateparams', JSON.stringify(gateparams));
              }
        
            var asset = self.find('.mura-asset > div.mura-object');
        
            if (asset.length) {
              Mura.resetAsyncObject(asset.node, empty);
              const assetparams=asset.data();
              delete assetparams.inited;
              self.data('assetparams', JSON.stringify(assetparams));
              }
        
            },
        });
    }

    //for writing to a mura.config.json or site client.config.json files
    getJSONConfig(siteid){
      if(siteid){
        if(!this.jsonConfig.siteid[siteid]){
          this.jsonConfig.siteid[siteid]={
            "rendererProperties":{},
            "modules":{}
          };
        }
        return this.jsonConfig.siteid[siteid];
      } else {
        return this.jsonConfig;
      }
    }

    getJSConfig(){

        const MuraConfig={
            ComponentRegistry: this.generateModuleLookup(),
            ExternalModules: this.externalLookup,
            ConnectorConfig: this.connectorConfig
        };

        if(typeof window == 'undefined'){
          const configPath=process.cwd() + '/public/mura.config.json'
          import('fs').then(fs=>{
            fs.access(configPath, fs.F_OK, (err) => {
              if (err) {
                this.exportJSON(configPath);
                return
              }
            })
          })
        }

        return MuraConfig;  
    }

    exportJSON(path,siteid){
      if(typeof window == 'undefined'){
        import('fs').then((fs=>{
          fs.writeFile(path,JSON.stringify(this.getJSONConfig(siteid)), err => {
            if (err) {
              console.error(err);
            }
          })
        }));
      }
    }

  }

export default Builder;