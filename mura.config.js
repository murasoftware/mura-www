import Builder from 'Builder.js';
import { ModuleLibrary } from '@murasoftware/next-modules-bs4';

export const DisplayOptions = {
  cookieconsent:true
};

export const getConfiguredMura=async function(context){
  const builder=new Builder({
    rootpath: process.env.rootpath,
    processMarkup: false,
    sitename: process.env.sitename,
    htmleditortype: process.env.htmleditortype,
    indexfileinapi:false,
    multitenant: true
  })
  await builder.registerLib(ModuleLibrary);
  const Mura=builder.getMura(context);
  return Mura;
}