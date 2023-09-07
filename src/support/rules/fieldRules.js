const rules = {
  required: (value, label) => {
    return !!value || (label ? `<p>El campo <b> ${label} </b> es obligatorio</p>` : 'El campo es obligatorio')
  },
  email: (value, label) => {
    if (!value) return true;
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
      "Formato de email incorrecto"
  },

  /*Files*/
  requiredFile: (value, label) => {
    return value.length > 0 || (label ? `El campo <b>${label} </b>es obligatorio` : 'El campo es obligatorio')
  },
  customRegex: (value, reg) => {
    const regex = new RegExp(reg, "g");
    return regex.test(value[0].name) || `Error . El nombre del fichero no cumple los requisitos de formato`;
    //TODO: Personalizar mensaje de error con la expresión regular
  },
  pwdConfirm: (value, password) => {
    if (!value) return "Campo obligatorio";
    return value === password || "Las contraseñas no coinciden"
  },
  telephone: (value) => {
    if (!value) return true;
    return /^(([\+]?[0-9]{2,3})?[0-9]{9}){1}([\,]([+]?[0-9]{2,3})?[0-9]{9}){0,}?$/.test(value) ||
      "Formato de telefono incorrecto"
  },

}


export default rules;
