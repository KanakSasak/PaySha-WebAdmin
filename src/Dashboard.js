import React, {useEffect, useState} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {useHistory} from "react-router";
import "./Dashboard.css";
import {auth, logout} from "./firebase";
import axios from "axios";
import QRCode from "react-qr-code";
import { Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


const client = axios.create({
    baseURL: "http://a8c0-36-90-123-166.ngrok.io"
});

function Dashboard() {
    const [user, loading, error] = useAuthState(auth);
    const [name, setName] = useState("");
    const [token, setToken] = useState("");
    const [tujuan, setTujuan] = useState("");
    const [amount1, setAmount1] = useState("");
    const [amount2, setAmount2] = useState("");
    const [balance, setBalance] = useState("");
    const [statusTrx, setStatusTrx] = useState("");
    const [QR, setQR] = useState("default");
    const [dataServer, setDataServer] = useState("");
    const [isLoading, setLoading] = useState(false)
    const history = useHistory();


    async function LoginToBackend(idtoken) {
        const response = await client.post("/v1/cust/auth/login", {

            "code": idtoken,
            "device_id": "123",
            "device_type": "123",
            "phone": user?.phoneNumber,
            "signing_method": "phone",
            "token_fcm": "123456"

        });
        setDataServer(response.data);
        console.log(dataServer);
        console.log(idtoken);
        setLoading(false)
    }

    async function GetBalance() {
        setLoading(true)
        client.get("/v1/cust/get/wallet/balance", {
            headers: {
                'Authorization': `Bearer ` + dataServer.data.token
            }
        }).then((response) => {
            setBalance(response.data);
            SetQR();
            setLoading(false)
        });




    }


    async function Transfer(idtujuan, amount) {
        setLoading(true)
        client.post("/v1/cust/bayar/" + idtujuan + "/" + amount + "", {}, {
            headers: {
                'Authorization': `Bearer ` + dataServer.data.token
            }
        }).then((response) => {
            //setStatusTrx(response.data);
            setLoading(false)
            GetBalance()
        });


    }

    async function Minting(amount) {
        setLoading(true)
        client.post("/v1/cust/mint/" + amount + "", {}, {
            headers: {
                'Authorization': `Bearer ` + dataServer.data.token
            }
        }).then((response) => {
            //setStatusTrx(response.data);
            setLoading(false)
            GetBalance()
        });


    }

    async function SetQR() {
        if (dataServer?.data?.data?.wallet) {
            setQR(dataServer?.data?.data?.wallet)
        } else {
            setQR("default")
        }

    }


    useEffect(() => {
        if (loading) return;
        if (!user) return history.replace("/");
        setLoading(true)
        user.getIdToken(/* forceRefresh */ true).then(function (idToken) {
            // Send token to your backend via HTTPS
            setToken(idToken)
            LoginToBackend(idToken);
            // ...
        }).catch(function (error) {
            // Handle error
        });
        SetQR();
        if (dataServer?.data?.data?.wallet) {
            setQR(dataServer?.data?.data?.wallet)
        } else {
            setQR("default")
        }


    }, [user, loading]);

    return (
        <div className="dashboard">
            <div className="dashboard__container">

                {isLoading ? (
                    <div>
                        <Spinner animation="grow" variant="primary"/>
                    </div>
                    ):(
                        <div></div>
                )}



                <div>{statusTrx}</div>
                Logged in as
                <div>{name}</div>
                <div>{user?.email}</div>
                <div>{dataServer?.data?.data?.phone}</div>
                <div>-------------------------</div>
                <h3>Balance</h3>
                <h1>{balance?.data}</h1>
                <div>-------------------------</div>
                <div><h4>wallet id : </h4></div>
                <div></div>
                <QRCode value={QR}/>
                <div>-------------------------</div>
                <div></div>
                <input
                    type="text"
                    className="login__textBox"
                    value={tujuan}
                    onChange={(e) => setTujuan(e.target.value)}
                    placeholder="Wallet Tujuan"
                />
                <input
                    type="text"
                    className="login__textBox"
                    value={amount1}
                    onChange={(e) => setAmount1(e.target.value)}
                    placeholder="Amount"
                />
                <button
                    className="login__btn"
                    onClick={() => Transfer(tujuan, amount1)}
                >
                    Transfer
                </button>
                <div>-------------------------</div>
                <div></div>
                <input
                    type="text"
                    className="login__textBox"
                    value={amount2}
                    onChange={(e) => setAmount2(e.target.value)}
                    placeholder="Amount"
                />
                <button
                    className="login__btn"
                    onClick={() => Minting(amount2)}
                >
                    Minting
                </button>
                <div>-------------------------</div>
                <div></div>
                <button className="dashboard__btn" onClick={GetBalance}>
                    Update Balance & Refresh QR
                </button>
                <button className="dashboard__btn" onClick={logout}>
                    Logout
                </button>
                <div>*it's mvp maybe contains bugs</div>
            </div>

        </div>
    );
}

export default Dashboard;