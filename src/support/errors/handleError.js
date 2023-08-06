const handleError = {
    getErrorNormalizado: (error) => {
        let msg = 'Error genérico'
        if (error.response) {
            msg = error.response.data.msg;
        }
        return msg;
    },
};


export default handleError;