import React,{useState,useEffect} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
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
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [showingAlert,setShowingAlert] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        updateExperience(curSelPersona,curSelStage);        
        // setUpdateSuccess(1);
        return false;
    }

    const updateSelectedPersona = (e) => {
        const newPersona = e.target.value;
        if (curSelPersona != newPersona){
            setCurSelPersona(newPersona);
            updateButtonStatus(newPersona,curSelStage);
        }
    }

    const updateSelectedStage = (e) => {
        const newStage = e.target.value;
        if (curSelStage != newStage){
            setCurSelStage(newStage);
            updateButtonStatus(curSelPersona,newStage);
        }        
    }

    const updateButtonStatus = (persona,stage) => {
        if (persona != '' && stage != ''){
            setButtonEnabled(true);
        } else {
            setButtonEnabled(false);
        }
    }

    const updateExperience = async (personaid,stageid) => {
        const Personaid = personaid;
        const Stageid = stageid;
    
        const exp = await Mura
          .getEntity('matrix_selector')
          .invoke(
            'updateExperience',
            {
                personaid:personaid,
                stageid:stageid
            }
          );
        
        if (exp.personaselected || exp.stageselected){
            setUpdateSuccess(1);
            setShowingAlert(true);
        }
    
        if (exp.personaSelected){
            Mura(function(){
                Mura.trackEvent({
                        category: 'Matrix Self ID',
                        action: 'Persona',
                        label:  '#esapiEncode("javascript",personaName)#'
                });
            });
        }
        
        if (exp.stageSelected){
            Mura(function(){
                Mura.trackEvent({
                        category: 'Matrix Self ID',
                        action: 'Stage',
                        label: '#esapiEncode("javascript",stageName)#'
                });
            });
        }
    
    }

    //show alert or not
    // useEffect(() => {
    //     let isMounted = true;
    //     if (isMounted) {
    //         if(showingAlert){
    //             setTimeout(() => {
    //                 setShowingAlert(false);
    //             }, 2000);
    //         }
    //     }

    //     return () => { isMounted = false };
    // }, [showingAlert]);

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
            {updateSuccess && showingAlert &&
                <Alert variant="success" >
                    <h3>Thanks!</h3>
                    <p>We&rsquo;re tailoring our content for you&hellip;</p>
                </Alert>
            }
            {!updateSuccess && !showingAlert &&
            <Form inline id="mura_matrix-selector-form" onSubmit={handleSubmit} data-autowire="false">
                <div className="select-wrap">
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
                </div>
                <div className="w-100 mt-3">
                <Button variant="primary" type="submit" disabled={!buttonEnabled}>
                    Submit
                </Button>
                </div>
            </Form>
            }
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
    return stageIds;
}

export default MatrixSelector;