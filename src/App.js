import "./App.css";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import "bootstrap/dist/css/bootstrap.min.css";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { Col } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import axios from "axios";
import Noti from "./Components/toasts";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { transcript, resetTranscript } = useSpeechRecognition({
    continuous: true,
  });

  const [hindi, setHindi] = useState("");
  const [english, setEnglish] = useState("");

  useEffect(() => {
    setEnglish(transcript);
  }, [transcript]);
  console.log(hindi);

  const translate = () => {
    const params = new URLSearchParams();
    params.append("q", transcript);
    params.append("source", "en");
    params.append("target", "hi");
    params.append("api-key", "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx");
    params.append("mode", "no-cors");
    if (transcript !== "") {
      axios
        .post("http://libretranslate.de/translate", params, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
            "Access-Control-Allow-Origin": "*",
          },
        })
        .then((res) => {
          console.log(res.data.translatedText);
          setHindi(res.data.translatedText);
        });
    } else {
      console.log("Say Something");
      toast.error("Say Something!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  const Reset = () => {
    setHindi("");
    setEnglish("");
    resetTranscript();
  };

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return null;
  }

  return (
    <div className="App">
      <Container>
        <Row>
          <h1 className="Header">Speech To Text</h1>
        </Row>
        <Row>
          <Card>
            <Container className="Language">
              <Row>
                <Col>
                  <Row>
                    <h3>English</h3>
                  </Row>
                  <Row>
                    <div className="Text">{english}</div>
                  </Row>
                </Col>
                <Col>
                  <Row>
                    <h3>Hindi</h3>
                  </Row>
                  <Row>
                    <div className="Text">{hindi}</div>
                  </Row>
                </Col>
              </Row>
            </Container>
            <Card.Body>
              <ButtonGroup className="me-2" aria-label="First group">
                <Button
                  variant="outline-success"
                  onClick={SpeechRecognition.startListening}
                >
                  Start Recording
                </Button>{" "}
                <Button
                  variant="outline-danger"
                  onClick={SpeechRecognition.stopListening}
                >
                  Stop Recording
                </Button>{" "}
                <Button variant="outline-warning" onClick={Reset}>
                  Reset
                </Button>{" "}
                <Button variant="outline-primary" onClick={translate}>
                  Translate
                </Button>{" "}
              </ButtonGroup>
            </Card.Body>
          </Card>
        </Row>
        <ToastContainer />
      </Container>
    </div>
  );
}

export default App;
