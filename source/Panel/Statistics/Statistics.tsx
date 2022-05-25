import { Component, ReactNode } from "react";
import { useStatusWithEvent, IMixinStatusProps } from "@Context/Status";
import { useSettingWithEvent, IMixinSettingProps, Themes } from "@Context/Setting";
import {
    Chart as ChartJS, CategoryScale, LinearScale,
    BarElement, Tooltip, Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Theme } from "@Component/Theme/Theme";
import { Icon } from "@fluentui/react";
import { Model } from "@Model/Model";
import { Group } from "@Model/Group";
import { ActuatorModel } from "@Model/Actuator";
import { Message } from "@Input/Message/Message";
import "./Statistics.scss";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
);

enum ChartType {

}

interface IStatisticsProps {

}

@useSettingWithEvent("themes", "language", "lineChartType")
@useStatusWithEvent("focusClipChange", "actuatorStartChange", "fileLoad", "modelUpdate", "individualChange")
class Statistics extends Component<IStatisticsProps & IMixinStatusProps & IMixinSettingProps> {

    public barDarkOption = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: {
            position: 'bottom' as const,
            labels: { boxWidth: 10, boxHeight: 10, color: 'rgba(255, 255, 255, .5)' }
        }},
        scales: {
            x: { grid: { color: 'rgba(255, 255, 255, .2)' }, title: { color: 'rgba(255, 255, 255, .5)'} },
            y: { grid: { color: 'rgba(255, 255, 255, .2)', borderDash: [3, 3] }, title: { color: 'rgba(255, 255, 255, .5)'} }
        }
    };

    public barLightOption = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: {
            position: 'bottom' as const,
            labels: { boxWidth: 10, boxHeight: 10, color: 'rgba(0, 0, 0, .5)' }
        }},
        scales: {
            x: { grid: { color: 'rgba(0, 0, 0, .2)' }, title: { color: 'rgba(0, 0, 0, .5)'} },
            y: { grid: { color: 'rgba(0, 0, 0, .2)', borderDash: [3, 3] }, title: { color: 'rgba(0, 0, 0, .5)'} }
        }
    };

    private modelBarChart(model: Model, theme: boolean) {

        const datasets: any[] = [];
        const labels: any[] = ["Group"];
        
        // 收集数据
        model.objectPool.forEach((obj) => {
            let label = obj.displayName;
            let color = `rgb(${obj.color.map((v) => Math.floor(v * 255)).join(",")})`;
            
            if (obj instanceof Group) {
                datasets.push({label, data: [obj.individuals.size], backgroundColor: color});
            }
        });

        if (datasets.length <= 0) {
            return <Message i18nKey="Panel.Info.Statistics.Nodata"/>
        }

        return <Bar
            data={{datasets, labels}}
            options={theme ? this.barLightOption : this.barDarkOption }
        />
    }

    private renderChart() {

        let themes = this.props.setting?.themes === Themes.light;

        // 播放模式
        if (this.props.status?.focusClip) {
            return this.modelBarChart(this.props.status.model, themes);
        }

        // 正在录制中
        else if (
            this.props.status?.actuator.mod === ActuatorModel.Record ||
			this.props.status?.actuator.mod === ActuatorModel.Offline
        ) {
            return this.modelBarChart(this.props.status.model, themes);
        }

        // 主时钟运行
        else if (this.props.status) {
            return this.modelBarChart(this.props.status.model, themes);
        }
    }

    public render(): ReactNode {
        return <Theme className="statistics-panel">

            {
                (
                    this.props.status?.focusClip ||
                    this.props.status?.actuator.mod === ActuatorModel.Record ||
                    this.props.status?.actuator.mod === ActuatorModel.Offline
                ) ?

                <div className="statistics-switch">
                    <div className="switch-button" onClick={() => {
                        this.props.setting?.setProps("lineChartType", !this.props.setting?.lineChartType);
                    }}>
                        <Icon iconName={
                            this.props.setting?.lineChartType ? "BarChartVertical" : "LineChart"
                        }/>
                    </div>
                </div>

                : null
            }

            <div className="statistics-chart">
                { this.renderChart() }
            </div>
        </Theme>;
    }
}

export { Statistics };