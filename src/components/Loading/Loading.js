import { Grid } from  'react-loader-spinner'
import styles from './Loading.module.scss';
import {
    Container,
    Row,
    Col,
} from 'react-bootstrap';

const Loading = () => {
    return (
        <div className={styles.loadingContainer} fluid={true}>
            <div className={styles.loadingRow}>
                <Col className={styles.loadingCol} xs="auto">
                    <Grid
                        height="80"
                        width="80"
                        color="#D01315"
                        ariaLabel="Loading content"
                        radius="12.5"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                    />
                </Col>            
            </div>
        </div>
    )
}

export default Loading;