import MuraBuilder from 'builder';
import { ModuleLibrary } from '@murasoftware/next-modules-bs4';

const builder=new MuraBuilder( {
  rootpath: process.env.rootpath,
  siteid: process.env.siteid,
  processMarkup: false,
  editroute: process.env.editroute,
  sitename: process.env.sitename,
  siteidinurls:  process.env.siteidinurls,
  codeblocks: process.env.codeblocks,
  variations: process.env.variations,
  MXP: process.env.MXP,
  htmleditortype: process.env.htmleditortype,
  indexfileinapi:false,
  multitenant: process.env.multitenant
});

builder.registerLib(ModuleLibrary);

export const Builder=builder;
export const DisplayOptions = {
  cookieconsent:true
};