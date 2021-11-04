import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router";
import "./Dashboard.css";
import {auth, db, logout, signInWithEmailAndPassword} from "./firebase";
import axios from "axios";
import QRCode from "react-qr-code";


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
    const [QR, setQR] = useState("default");
    const [dataServer, setDataServer] = useState("");
    const history = useHistory();


    const GetToken = async () => {
        try {

        } catch (err) {
            console.error(err);
            alert("An error occured while fetching user data");
        }
    };


            async function LoginToBackend(idtoken) {
                const response = await client.post("/v1/cust/auth/login",{

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
            }

    async function GetBalance() {
        const response = await client.get("/v1/cust/get/wallet/balance",{
            headers: {
                'Authorization': `Bearer `+dataServer.data.token
            }
        })
        setBalance(response.data);

    }

    async function Transfer(idtujuan,amount) {
        const response = await client.post("/v1/cust/bayar/"+idtujuan+"/"+amount+"",{},{
            headers: {
                'Authorization': `Bearer `+dataServer.data.token
            }
        })
        setBalance(response.data);

    }

    async function Minting(amount) {
        const response = await client.post("/v1/cust/mint/"+amount+"",{},{
            headers: {
                'Authorization': `Bearer `+dataServer.data.token
            }
        })
        setBalance(response.data);

    }





    useEffect(() => {
        if (loading) return;
        if (!user) return history.replace("/");
        user.getIdToken(/* forceRefresh */ true).then(function(idToken) {
            // Send token to your backend via HTTPS
            setToken(idToken)
            LoginToBackend(idToken);
            // ...
        }).catch(function(error) {
            // Handle error
        });
        setQR(dataServer?.data?.data?.wallet)


    }, [user, loading]);

    return (
        <div className="dashboard">
            <div className="dashboard__container">
                Logged in as
                <div>{name}</div>
                <div>{user?.email}</div>
                <div>{dataServer?.data?.data?.phone}</div>
                <div>-------------------------</div>
                <div><h3>Balance {balance?.data}</h3></div>
                <div>-------------------------</div>
                <div><h4>wallet id : </h4></div>
                <div></div>
                <QRCode value={QR} />
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
                    onClick={() => Minting(tujuan, amount2)}
                >
                    Minting
                </button>
                <div>-------------------------</div>
                <div></div>
                <button className="dashboard__btn" onClick={GetBalance}>
                    Update Balance
                </button>
                <button className="dashboard__btn" onClick={logout}>
                    Logout
                </button>
            </div>
        </div>
    );
}

export default Dashboard;