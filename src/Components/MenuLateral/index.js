import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import { IoIosPerson, IoIosCalendar, IoIosDocument } from "react-icons/io";
import styles from "./MenuLateral.module.css";

export default function MenuLateral() {
  return (
    <Sidebar className={`${styles.menulat}`}>
      <Menu
        menuItemStyles={{
          button: {
            // the active class will be added automatically by react router
            // so we can use it to style the active menu item
            [`&.active`]: {
              backgroundColor: "#13395e",
              color: "#b6c8d9",
            },
          },
        }}
      >
        <SubMenu label="Funcionarios" icon={<IoIosPerson />}>
          <MenuItem component={<Link to="/CadastrarFuncionario" />}>
            Cadastrar
          </MenuItem>
          <MenuItem component={<Link to="/DeletarFuncionario" />}>
            Deletar
          </MenuItem>
          <MenuItem component={<Link to="/ConsultarFuncionario" />}>
            Consultar
          </MenuItem>
        </SubMenu>
        <SubMenu label="Ponto" icon={<IoIosCalendar />}>
          <MenuItem component={<Link to="/CadastrarPonto" />}>
            Cadastrar
          </MenuItem>
          <MenuItem component={<Link to="/ConsultarPonto" />}>
            Consultar
          </MenuItem>
          <MenuItem component={<Link to="/DeletarPonto" />}> Deletar </MenuItem>
        </SubMenu>
        <MenuItem component={<Link to="/Historico" />} icon={<IoIosCalendar />}>
          Historico
        </MenuItem>
        <MenuItem
          component={<Link to="/Relatorios" />}
          icon={<IoIosDocument />}
        >
          Relatórios
        </MenuItem>
      </Menu>
    </Sidebar>
  );
}
