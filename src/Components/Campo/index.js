import "./campo.css";

const Campo = ({
  type = "text",
  label,
  placeholder,
  valor,
  aoAlterado,
  obrigatorio = false,
  complete = "off",
}) => {
  return (
    <div className={`campo campo-${type}`}>
      <label>{label}</label>
      <input
        type={type}
        value={valor}
        placeholder={placeholder}
        onChange={(evento) => aoAlterado(evento.target.value)}
        required={obrigatorio}
        autoComplete={complete}
      />
    </div>
  );
};

export default Campo;
