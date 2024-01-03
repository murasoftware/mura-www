import Builder from 'Builder.js';
import { ModuleLibrary } from '@murasoftware/next-modules-bs4';

export const DisplayOptions = {
  cookieconsent:true
};

export const getConfiguredMura=async function(context){
  const builder=new Builder({
    rootpath: process.env.rootpath,
    siteid: process.env.siteid,
    processMarkup: false,
    editroute: process.env.editroute,
    sitename: process.env.sitename,
    siteidinurls:  process.env.siteidinurls,
    htmleditortype: process.env.htmleditortype,
    indexfileinapi:false,
    multitenant: process.env.multitenant
  })
  await builder.registerLib(ModuleLibrary);
  const Mura=builder.getMura(context);
  return Mura;
}