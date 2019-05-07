import React, { Component } from "react";
import "./styles/form.css";

export default class Form extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // Grab 'databaseTimeout' value from backend
      databaseTimeout: "10000",
      formError: { incomplete: false, emptySubmit: false }
    };

    this.valueChange = this.valueChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  valueChange({ target }) {
    const { name, value } = target;
    this.setState({ [name]: value });
  }

  submit() {
    event.preventDefault();
    if (!this.isFormValid()) return false;

    this.props.onSubmit(JSON.stringify(this.state));
    this.setState({
      formError: { incomplete: false }
    });
  }

  isFormValid() {
    let incompleteField = false;

    for (let field in this.state) {
      if (field !== "formError") {
        if (this.state[field] === "") incompleteField = true;
      }
    }

    if (incompleteField === true) {
      this.setState({ formError: { incomplete: true } });
      return false;
    }

    return true;
  }

  render() {
    let formError;

    if (this.state.formError.incomplete) {
      formError = (
        <div className="warning">
          <b>*</b>These fields are required.
        </div>
      );
    } else if (this.state.formError.emptySubmit) {
      formError = <div className="warning">Empty Submit!</div>;
    }

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
            {formError}
          </div>
        </form>
      </div>
    );
  }
}
