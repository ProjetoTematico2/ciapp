import { useNavigate } from 'react-router-dom'
import React, { useState, useEffect, useRef } from "react";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Title from "../layout/Title";
import { toast } from 'react-toastify';
import ModalAgendamento from './ModalAgendamento';
import Load from "../layout/Load";
import { Button } from 'react-bootstrap';
import moment from 'moment';

export default function Index() {
    const navigate = useNavigate();
    const [showModalAgendamento, setShowModalAgendamento] = useState(false);
    const [tempID, setempID] = useState(0);
    const [load, setLoad] = useState(false);

    const [agendamento, setAgendamento] = useState([]);
    const [agendamentos, setAgendamentos] = useState({
        agendamento_dia_inicial: '',
        agendamento_dia_final: null,
        agendamento_horario_inicio: '09:00',
        agendamento_horario_fim: '17:00',
        agendamento_dias_semana: {},
        processo: {},
        tarefa: []
    });

    const [modelAgendamento, setModelAgendamento] = useState({
        id: null,
        agendamento_dia_inicial: '',
        agendamento_dia_final: null,
        agendamento_horario_inicio: '09:00',
        agendamento_horario_fim: '17:00',
        agendamento_dias_semana: [],
        processo: '',
        entidade: '',
        tarefa: '',
        novo_registro: true
    });



    const fetchData = async () => {
        setLoad(true);
        const data = await window.api.Action({ controller: "Agendamentos", action: "GetAgendamentos", params: null });
        setLoad(false);
        setAgendamentos(data);
    }

    const formatDateInitial = ({ agendamento_dia_inicial }) => {
        const [year, month, day] = agendamento_dia_inicial.split('-');
        return `${day}/${month}/${year}`;
    }

    const formatDateFinally = ({ agendamento_dia_final }) => {
        if (agendamento_dia_final) {
            const [year, month, day] = agendamento_dia_final.split('-');
            return `${day}/${month}/${year}`;
        }
        return "--";
    }



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
            <div className='menu'>

                <button className='menu-button button-dark-blue ' onClick={() => { CreateAgendamento() }}>
                    <i className='fa-solid fa-plus'></i> Novo
                </button>
            </div>

            <div className='row table-container'>
                <div className='col-md-12'>
                    {agendamentos.length > 0 ?
                        <div className="tabs-agendamentos">
                            <Title title={"Agendamentos"} />

                            <table className='table table-small table-bordered table-hover'>
                                <thead>
                                    <tr>
                                        <th>Processo</th>
                                        <th>Tarefa</th>
                                        <th>Data Inicial</th>
                                        <th>Data Final</th>
                                        <th>Hora Inicial</th>
                                        <th>Hora Final</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {agendamentos.map(r => (
                                        <tr key={r.id} style={{ verticalAlign: "middle" }}>
                                            <td>{r.processo.nro_processo}</td>
                                            <td>{r.tarefa.titulo}</td>
                                            <td>{ moment(r.agendamento_dia_inicial).locale('pt').format('L')}</td>
                                            <td>{r.agendamento_dia_final == null ? 
                                            "Sem data definida": 
                                            moment(r.agendamento_dia_final).locale('pt').format('L') }
                                            </td>
                                            <td>{r.agendamento_horario_inicio}</td>
                                            <td>{r.agendamento_horario_fim}</td>

                                            <td>
                                                <div className="btn-group" role="group">

                                                    <span id="btnGroupDrop1" type="button" className="btn btn-custom dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                                        <i className='fa fa-cog'></i> Opções
                                                    </span>
                                                    <ul className="dropdown-menu" aria-labelledby="btnGroupDrop1">
                                                        <li> <Button className="dropdown-item" id="edit" onClick={(_) => EditAgendamento(r)} > <i className='fa fa-edit'></i> Editar</Button></li>
                                                        {r.somente_leitura == true ?
                                                            null
                                                            :
                                                            <li> <Button className="dropdown-item" id="delete"
                                                                onClick={(_) => { DeleteAgendamento(r) }}> <i className='fa fa-trash'></i> Excluir</Button>
                                                            </li>
                                                        }

                                                    </ul>
                                                </div>
                                            </td>

                                        </tr>

                                    ))}
                                </tbody>
                            </table>
                        </div>
                        : <div className="col-md-12 zero-count">Nenhum registro localizado.</div>}
                </div>
            </div>

        

            <ModalAgendamento Model={modelAgendamento} show={showModalAgendamento} onHide={() => { handleModalAgendamento(false) }} onAdd={createAgendamento} onEdit={editAgendamento} />
            <Load show={load} />
        </>


    );
}