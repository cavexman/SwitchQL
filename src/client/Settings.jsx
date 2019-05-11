import React, { Component } from "react";
import "./styles/form.css";
import { ipcRenderer } from "electron";
import * as events from "../server/events";

export default class Form extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // Defaults set from backend
      databaseTimeout: 0
    };

    this.valueChange = this.valueChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentDidMount() {
    ipcRenderer.on(events.SETTINGS_DATA, (sender, args) => {
      this.setState({
        databaseTimeout: args.databaseTimeout
      });
    });
  }

  valueChange({ target }) {
    const { name, value } = target;
    if (name === "databaseTimeout") this.setState({ [name]: Number(value) });
    else this.setState({ [name]: value });
  }

  submit() {
    event.preventDefault();
    this.props.onSubmit(this.state);
  }

  render() {
    const classList = this.props.isOpen
      ? `formvis fadeInScale`
      : `formvis fadeOutScale`;

    return (
      <div className={classList}>
        <form onSubmit={this.submit}>
          <div className="formIn">
            <div className="welcome">Settings</div>

            <div className="connect">Database Timeout (ms)</div>
            <textarea
              placeholder="Timeout*"
              name="databaseTimeout"
              className="question"
              required
              autoComplete="off"
              type="number"
              value={this.state.databaseTimeout}
              onChange={this.valueChange}
            />

            <button
              type="button"
              className="button"
              onClick={() => {
                this.submit();
              }}
            >
              Apply Settings
            </button>

            <button
              type="button"
              className="exit"
              onClick={() => this.props.onClose()}
            >
              ×
            </button>
          </div>
        </form>
      </div>
    );
  }
}
