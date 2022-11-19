
export default async (req, res) => {

    global.siteidmap=global.siteidmap || {};
    delete global.siteidmap[req.query.siteid];

    res.send('done');
   
}