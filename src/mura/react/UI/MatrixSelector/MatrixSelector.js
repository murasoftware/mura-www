import React,{useState,useEffect} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function MatrixSelector(props){
    const objectparams = Object.assign({}, props);
    // console.log(objectparams);

    const _personaIds = objectparams.dynamicProps ? objectparams.dynamicProps.personaProps : '';
    const _stageIds = objectparams.dynamicProps ? objectparams.dynamicProps.stageProps : '';

    const [personaIds, setPersonaIds] = useState(_personaIds);
    const [stageIds, setStageIds] = useState(_stageIds);

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
            <Form inline id="resource-filter-form">
                {personaIds.length > 0 &&
                <>
                    <Form.Label className="mr-2">Persona Question</Form.Label>
                    <Form.Control as="select" name="persona" size="sm" className="mr-2">
                        <option value="" key="--">--</option>
                        {personaIds.map((personaId) => (
                        <option value={personaId.personaid} key={personaId.personaid}>{personaId.name}</option>
                        ))}
                    </Form.Control>
                </>
                }
                {stageIds.length > 0 &&
                <>
                    <Form.Label className="mr-2">Stage Question</Form.Label>
                    <Form.Control as="select" name="stage" size="sm">
                        <option value="" key="--">--</option>
                        {stageIds.map((stageId) => (
                        <option value={stageId.stageid} key={stageId.stageid}>{stageId.name}</option>
                        ))}
                    </Form.Control>
                </>
                }
                <div className="w-100 mt-3">
                <Button variant="primary" type="submit">
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