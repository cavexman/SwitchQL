import React, { Component } from "react";
import ReactDOM from "react-dom";
import { ipcRenderer } from "electron";
import { ToastContainer, toast } from "react-toastify";
import { Loader } from "react-loaders";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import Form from "./Form.jsx";
import Settings from "./Settings.jsx";
import ZipFolder from "./ZipFolder.jsx";
import * as events from "../server/events";
import util from "../server/util"

import logo from "./img/logo.png";
import "loaders.css/src/animations/ball-scale-ripple-multiple.scss";
import "react-toastify/dist/ReactToastify.css";
import "./styles/main.css";


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      schema: "",
      mutations: "",
      queries: "",
      isFormOpen: true,
      isSettingsOpen: false,
      tabIndex: 0,
      isLoading: false,
      exportDisabled: true,
      formDisabled: false,
      settingsDisabled: false
    };

    this.showSettings = this.showSettings.bind(this);
    this.hideSettings = this.hideSettings.bind(this);
    this.showForm = this.showForm.bind(this);
    this.hideForm = this.hideForm.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.onExport = this.onExport.bind(this);
  }

  componentDidMount() {
    ipcRenderer.on(events.APP_ERROR, () => {
      this.setState(prev => ({
        isLoading: false,
        formDisabled: false,
        exportDisabled: !(prev.schema && prev.mutations && prev.queries)
      }));
      toast.error(`Could not connect to database.
      			 Please check your connection
             string and try again`);

      util.timeOut(3000, () => {
        this.setState({
          isFormOpen: true
        });
      })
    });

    ipcRenderer.on(events.DATA, (event, args) => {
      const data = JSON.parse(args);
      this.setState({
        ...data,
        isLoading: false,
        exportDisabled: false,
        formDisabled: false
      });
    });

    ipcRenderer.on(events.EXPORT_SUCCESS, () => {
      this.setState({
        isLoading: false,
        exportDisabled: false,
        formDisabled: false
      });
      toast.success("Successfully Exported Code");
    });
  }

  showSettings() {
    this.setState({ isSettingsOpen: true });
  }

  hideSettings() {
    this.setState({ isSettingsOpen: false, tabIndex: 0 });
  }

  submitSettings(settingsData) {
    ipcRenderer.send(events.SETTINGS, settingsData);
  }

  showForm() {
    this.setState({ isFormOpen: true });
  }

  hideForm() {
    this.setState({ isFormOpen: false, tabIndex: 0 });
  }

  submitForm(formData) {
    ipcRenderer.send(events.URL, formData);
    this.setState({
      isLoading: true,
      isFormOpen: false,
      formDisabled: true,
      exportDisabled: true
    });
  }

  onExport(path) {
    ipcRenderer.send(events.DIRECTORY, path);
    this.setState({
      isLoading: true,
      formDisabled: true,
      exportDisabled: true
    });
  }

  render() {
    return (
      <div>
        <div id="body" className="vis">
          <ToastContainer />

          <div
            className={
              this.state.isLoading ? "loadWrapper" : "loadWrapperHidden"
            }
          >
            <Loader
              active={this.state.isLoading}
              type="ball-scale-ripple-multiple"
              className="loader"
              color={"#ffc1df"}
            />
          </div>

          <div className="headerFont">
            <img src={logo} className="logoMain" />
            switch<b>QL</b>
            <button
              type="button"
              className="setttingsButton"
              onClick={() => this.showSettings()}
              disabled={this.state.settingsDisabled}
            >
              Settings
            </button>
          </div>

          <Tabs
            selectedIndex={this.state.tabIndex}
            onSelect={tabIndex => this.setState({ tabIndex })}
            selectedTabClassName="active"
          >
            <TabList>
              <div>
                <Tab className="flexTabs">Type Definitions</Tab>
                <Tab className="flexTabs">Client Mutations</Tab>
                <Tab className="flexTabs">Client Queries</Tab>
              </div>
            </TabList>

            <TabPanel>
              <textarea
                className="areaOne"
                value={this.state.schema}
                readOnly
              />
            </TabPanel>
            <TabPanel>
              <textarea
                className="areaOne"
                value={this.state.mutations}
                readOnly
              />
            </TabPanel>
            <TabPanel>
              <textarea
                className="areaOne"
                value={this.state.queries}
                readOnly
              />
            </TabPanel>
          </Tabs>

          <ZipFolder
            onExport={this.onExport}
            disabled={this.state.exportDisabled}
          />

          <button
            type="button"
            className="bottomButtons"
            onClick={() => this.showForm()}
            disabled={this.state.formDisabled}
          >
            New Database
          </button>
        </div>

        <Form
          updateSchema={this.updateSchema}
          updateMutations={this.updateMutations}
          updateQueries={this.updateQueries}
          onClose={this.hideForm}
          onSubmit={this.submitForm}
          isOpen={this.state.isFormOpen}
        />

        <Settings
          onClose={this.hideSettings}
          onSubmit={this.submitSettings}
          isOpen={this.state.isSettingsOpen}
        />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
