import React,{useState,useEffect} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Mura from 'mura.js';

function MatrixSelector(props){
    const objectparams = Object.assign({}, props);
    // console.log(objectparams);

    const _personaIds = objectparams.dynamicProps ? objectparams.dynamicProps.personaProps : '';
    const _stageIds = objectparams.dynamicProps ? objectparams.dynamicProps.stageProps : '';

    const [personaIds, setPersonaIds] = useState(_personaIds);
    const [stageIds, setStageIds] = useState(_stageIds);

    const _personaQ = objectparams.personaq ? objectparams.personaq : 'Who are you?';
    const _stageQ = objectparams.stageq ? objectparams.stageq : 'Where are you in the process?';

    const [personaQ, setPersonaQ] = useState(_personaQ);
    const [stageQ, setStateQ] = useState(_stageQ);

    const [curSelPersona, setCurSelPersona] = useState('');
    const [curSelStage, setCurSelStage] = useState('');
    const [buttonEnabled, setButtonEnabled] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        updateExperience(curSelPersona,curSelStage);        
        // setUpdateSuccess(1);
        return false;
    }

    const updateSelectedPersona = (e) => {
        const newPersona = e.target.value;

        if (curSelPersona != newPersona){
            console.log('persona updated!');
            setCurSelPersona(newPersona);
            updateButtonStatus();
        }

    }

    const updateSelectedStage = (e) => {
        const newStage = e.target.value;

        if (curSelStage != newStage){
            console.log('stage updated!');
            setCurSelStage(newStage);
            updateButtonStatus();
        }

        
    }

    const updateButtonStatus = () => {
        console.log('persona: ' + curSelPersona + 'stage: ' + curSelStage)
        if (curSelStage != '' && curSelPersona != ''){
            setButtonEnabled(true);
        }
    }

    if(!objectparams.dynamicProps){
        useEffect(() => {
            let isMounted = true;
            if (isMounted) {
                getPersonas().then((personaProps) => {
                    if (isMounted) {
                        setPersonaIds(personaProps);
                    }
                });
                getStages().then((stageProps) => {
                    if (isMounted) {
                        setStageIds(stageProps);
                    }
                });
            }
            return () => { isMounted = false };
        }, []);
        
        return(
            <>
            <h3>Matrix Selector</h3>
            <Form inline id="resource-filter-form" onSubmit={handleSubmit} data-autowire="false">
                {personaIds.length > 1 &&
                <>
                    <Form.Label className="mr-2">{personaQ}</Form.Label>
                    <Form.Control as="select" name="persona" size="sm" className="mr-2" value={props.curSelPersona} onChange={updateSelectedPersona}>
                        <option value="" key="--">--</option>
                        {personaIds.map((personaId) => (
                        <option value={personaId.personaid} key={personaId.personaid}>{personaId.selfidq}</option>
                        ))}
                    </Form.Control>
                </>
                }
                {stageIds.length > 1 &&
                <>
                    <Form.Label className="mr-2">{stageQ}</Form.Label>
                    <Form.Control as="select" name="stage" size="sm" value={props.curSelStage} onChange={updateSelectedStage}>
                        <option value="" key="--">--</option>
                        {stageIds.map((stageId) => (
                        <option value={stageId.stageid} key={stageId.stageid}>{stageId.selfidq}</option>
                        ))}
                    </Form.Control>
                </>
                }
                <div className="w-100 mt-3">
                <Button variant="primary" type="submit" disabled={!buttonEnabled}>
                    Submit
                </Button>
                </div>
            </Form>
            </>
        )
    } else {

    }
}

export const getDynamicProps = async props => {
    const personaIds = await getPersonas();
    const stageIds = await getStages();
    
    return{
      personaProps:personaIds,
      stageProps:stageIds
    }
  }

const getPersonas = async () => {  
    
    const personaIds = await Mura
      .getEntity('matrix_selector')
      .invoke(
        'getPersonas'
      );
    // console.log(personaIds);
    return personaIds;
}

const getStages = async () => {  
    
    const stageIds = await Mura
      .getEntity('matrix_selector')
      .invoke(
        'getStages'
      );
    // console.log(stageIds);
    return stageIds;
}

const updateExperience = async () => {
    const personaid = '';
    const stageid = '';

    const experience = await Mura
      .getEntity('matrix_selector')
      .invoke(
        'updateExperience'
      );
    
    if (experience.personaSelected){
        Mura(function(){
            Mura.trackEvent({
                    category: 'Matrix Self ID',
                    action: 'Persona',
                    label:  '#esapiEncode("javascript",personaName)#'
            });
        });
    }
    
    if (experience.stageSelected){
        Mura(function(){
            Mura.trackEvent({
                    category: 'Matrix Self ID',
                    action: 'Stage',
                    label: '#esapiEncode("javascript",stageName)#'
            });
        });
    }

}

export default MatrixSelector;