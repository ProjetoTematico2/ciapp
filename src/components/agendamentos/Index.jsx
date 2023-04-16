import { useNavigate, NavLink } from 'react-router-dom'
import React, { useState, useEffect, useRef } from "react";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Title from "../layout/Title";
import { toast } from 'react-toastify';
import { Alert, Nav, NavItem, Tab, TabContainer, TabContent, TabPane } from 'react-bootstrap';
import Table from '../layout/Table';
import ModalAgendamento from './ModalAgendamento';


export default function Index(props) {
    const navigate = useNavigate();
    const [showModalAgendamento, setShowModalAgendamento] = useState(false);
    const [tempID, setempID] = useState(0);


    const [agendamento, setAgendamento] = useState([]);
    const [agendamentos, setAgendamentos] = useState({
        agendamento_dia_inicial: '',
        agendamento_horario_inicio: '08:00',
        agendamento_horario_fim: '18:00',
        agendamento_dias_semana: {},
        processo: {},
        tarefa: []
    });

    const [modelAgendamento, setModelAgendamento] = useState({
        id: null,
        agendamento_dia_inicial: '',
        agendamento_horario_inicio: '08:00',
        agendamento_horario_fim: '18:00',
        agendamento_dias_semana: [],
        processo: '',
        entidade: '',
        tarefa: '',
        novo_registro: true
    });



    const fetchData = async () => {
        const data = await window.api.Action({ controller: "Agendamentos", action: "GetAgendamentos", params: null });
        setAgendamentos(data);
    }

    const formatDate = ({ agendamento_dia_inicial }) => {
        const [year, month, day] = agendamento_dia_inicial.split('-');
        return `${day}/${month}/${year}`;
    }

    const columnsAgendamento = [
        { Header: 'Processo', accessor: e => e.processo.nro_processo },
        { Header: 'Tarefa', accessor: e => e.tarefa.titulo },
        { Header: 'Data inicial', accessor: e => formatDate(e) },
        { Header: 'Hora Inicial', accessor: 'agendamento_horario_inicio' },
        { Header: 'Hora Final', accessor: 'agendamento_horario_fim' },
    ]

    const CreateAgendamento = () => {
        handleModalAgendamento(true);
    }

    const EditAgendamento = (evt) => {
        handleModalAgendamento(true, evt);
    }


    const handleSubmit = async (object, action = 'Create') => {
        let postResult = '';
        const payload = {
            agendamento: object
        }
        if (action == 'Create') {
            postResult = await window.api.Action({ controller: "Agendamentos", action: "Create", params: payload });
        } else {
            postResult = await window.api.Action({ controller: "Agendamentos", action: "Edit", params: payload });
        }

        if (!postResult.status) {
            toast.error(postResult.text, { autoClose: false });
        } else {
            toast.success(postResult.text, { autoClose: 3000 });
            fetchData();
        }
    }

    const DeleteAgendamento = async (agendamento) => {
        const handleClickDelete = async (agendamento) => {
            const result = await window.api.Action({ controller: "Agendamentos", action: "Delete", params: agendamento });
            if (result.status) {
                fetchData();
            }
        }

        confirmAlert({
            title: 'Confirmação',
            message: 'Tem certeza que deseja excluir este item?',
            buttons:
                [
                    {
                        label: 'Sim',
                        onClick: () => {
                            handleClickDelete(agendamento.id);
                        }
                    },
                    {
                        className: 'btn-blue',
                        label: 'Não',
                        onClick: () => {
                        }
                    }
                ]
        });
    }

    const getTempID = async () => {
        setempID(tempID - 1);
        return tempID - 1;
    }

    const handleModalAgendamento = (show = true, model = null) => {
        setModelAgendamento(model);
        setShowModalAgendamento(show);
        
    }

    const createAgendamento = async (object) => {
        if (object) {
            var agendamentos = agendamento;
          

            var exist 
           
            if (exist) {
                toast.error(`Agendamento já informado`, { autoClose: false });
                handleModalAgendamento(false);
                return;
            }
            if (object.novo_registro) {
                object.id = await getTempID();
            }

            agendamentos.push(object);

            setAgendamento([
                ...agendamentos,
            ]);
        }
        handleSubmit(object, 'Create');
        handleModalAgendamento(false, null);
    }

    const editAgendamento = (object) => {
        if (object) {
            var agendamentos = agendamento;

            const index = agendamentos.findIndex(s => s.id == object.id);
            agendamentos.splice(index, 1, object);

            setAgendamento([
                ...agendamentos
            ]);
        }
        handleSubmit(object, 'Edit');
        handleModalAgendamento(false, null);
        fetchData();
    }
    useEffect(() => {
        fetchData();
    }, []);
    return (

        <>
            <Title title={"Agendamentos"} />


            <div className='menu'>

                <button className='menu-button button-dark-blue ' onClick={() => { CreateAgendamento() }}>
                    <i className='fa-solid fa-plus'></i> Novo
                </button>
            </div>

            <div className='row table-container mt-5'>
                <div className='col-md-12'>
                    {agendamentos.length > 0 ?
                        <div className="tabs-agendamentos">
                            <Tab.Container defaultActiveKey="agendamentos">
                                <Nav variant="pills">
                                    <Nav.Item>
                                        <Nav.Link eventKey="agendamentos">
                                            Agendamentos
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>

                                <Tab.Content>

                                    <Tab.Pane eventKey="agendamentos">

                                        <Title title={"Agendamentos Cadastrados"} />
                                        <div className="row">
                                            <div className="col-md-12 no-padding">
                                                <Table
                                                    columns={columnsAgendamento}
                                                    data={agendamentos}
                                                    onEdit={EditAgendamento}
                                                    onDelete={DeleteAgendamento}
                                                />
                                            </div>
                                        </div>
                                    </Tab.Pane>
                                </Tab.Content>
                            </Tab.Container>
                        </div>
                        : "Agendamentos não encontrados"}

                </div>
            </div>

            <ModalAgendamento Model={modelAgendamento} show={showModalAgendamento} onHide={() => { handleModalAgendamento(false) }} onAdd={createAgendamento} onEdit={editAgendamento} />
        </>


    );
}