import React from "react";
import moment from "moment";
import * as d3 from "d3";
import colors from "./colors";
import {
  bottom_axis,
  left_axis,
  right_axis,
  horizontal_grid,
  tooltip_class,
  tooltip_inner,
  tooltip_header,
  tooltip_title,
  tooltip_stat,
  tooltip_list,
  tooltip_list_item
} from "./FunnelChart.module.css";

class FunnelChart extends React.Component {
  constructor(props) {
    super(props);
    this.width = 800;
    this.height = 250;
    this.heightMultiplier = 1;
    this.padding = 90;
    this.gap = 20;

    this.state = {
      activeTooltip: {}
    };
  }

  componentDidMount() {
    this.drawChart();
    let data = this.props.data || [];
    if (!data.length) return;
    let min, max;
    for (let d of data) {
      if (d.val) {
        if (!min) min = d.val;
        if (!max) max = d.val;
        if (d.val < min) min = d.val;
        if (d.val > max) max = d.val;
      }
    }
    data = data.filter(d => d.val !== undefined).sort((a, b) => b.val - a.val);
    this.updateBarChart({ min, max, data });
  }

  componentWillReceiveProps(newProps) {
    this.drawChart();
    let data = newProps.data || [];
    if (!data.length) return;
    let min, max;
    for (let d of data) {
      if (d.val) {
        if (!min) min = d.val;
        if (!max) max = d.val;
        if (d.val < min) min = d.val;
        if (d.val > max) max = d.val;
      }
    }
    data = data.filter(d => d.val !== undefined).sort((a, b) => b.val - a.val);
    this.updateBarChart({ min, max, data });
  }

  getCompanyList(tagID) {
    let { evaluations } = this.props;
    let orgs = evaluations
      .filter(e => (e.n_funnel || []).some(nt => nt === tagID))
      .map(e => (e.organization || {}).name);

    if (orgs.length > 5) {
      let extras = orgs.length - 5;
      orgs.length = 5;
      orgs.push(`... ${extras} more`);
    }
    return orgs;
  }

  updateBarChart({ min, max, data }) {
    this.barChartContainer
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("y", d => this.height / 2 - ((d.val / max) * this.height) / 2)
      .attr("height", d => (d.val / max) * this.height)
      .attr("x", (d, i) => (i * this.width) / data.length)
      .attr("width", (d, i) => this.width / data.length - this.gap)
      .attr("style", (d, i) => `fill: ${colors[i]}`)
      .on("mousemove", d => {
        this.tooltip
          .style("left", d3.event.pageX - 150 + "px")
          .style("top", d3.event.pageY - 120 + "px");
      })
      .on("mouseenter", d => {
        this.tooltip.style("display", "block");
        this.setState({ activeTooltip: d });
      })
      .on("mouseout", d => {
        this.tooltip.style("display", "none");
        this.setState({ activeTooltip: null });
      });

    this.numbersOutline
      .selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .text(d => d.val)
      .attr(
        "transform",
        (d, i) =>
          `translate(${(i * this.width) / data.length +
            (this.width / data.length - this.gap) / 2},${this.height / 2 + 5})`
      )
      .attr(
        "style",
        `
          text-anchor: middle;
          fill: white;
          font-size: 14px;
          text-align: center;          
          stroke: white;
          stroke-width: 2px;
          stroke-linecap: butt;
          stroke-linejoin: miter;
          opacity: 0.75;
        `
      );

    this.numbers
      .selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .text(d => d.val)
      .attr(
        "transform",
        (d, i) =>
          `translate(${(i * this.width) / data.length +
            (this.width / data.length - this.gap) / 2},${this.height / 2 + 5})`
      )
      .attr(
        "style",
        `
          text-anchor: middle;
          fill: #333;
          font-size: 14px;
          text-align: center;        
        `
      );

    this.transitionContainer
      .selectAll("polygon")
      .data(data)
      .enter()
      .append("polygon")
      .attr("points", (d, i) => {
        let x = this.height / 2 - ((d.val / max) * this.height) / 2;
        let y = (i * this.width) / data.length;
        let width = this.width / data.length - this.gap;
        let height = (d.val / max) * this.height;
        let next = data[i + 1];
        if (!next) return "";
        let nextX = this.height / 2 - ((next.val / max) * this.height) / 2;
        let nextHeight = (next.val / max) * this.height;
        let c1 = `${y + width},${x}`;
        let c2 = `${y + width},${x + height}`;
        let c3 = `${y + width + this.gap},${nextX + nextHeight}`;
        let c4 = `${y + width + this.gap},${nextX}`;
        let str = `${c1} ${c2} ${c3} ${c4}`;
        return str;
      })
      .attr("style", (d, i) => `opacity: 0.3; fill: ${colors[i]}`);

    let x = d3
      .scaleBand()
      .domain(d3.range(this.props.data.length))
      .range([0, this.width])
      .padding(0.1);

    let xAxis = g =>
      g.attr("transform", `translate(2,${this.height + 7})`).call(
        d3
          .axisBottom(x)
          .tickFormat(i => this.props.data[i].label)
          .tickSizeOuter(0)
      );

    let xAxis2 = g =>
      g.attr("transform", `translate(-7,${this.height / 2 + 5})`).call(
        d3
          .axisBottom(x)
          .tickFormat("•")
          .tickSize(this.height / 2)
      );

    this.grid.call(xAxis2);

    this.axisBottomContainer
      .call(xAxis)
      .selectAll("text")
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .attr("transform", "rotate(30)");
  }

  drawChart() {
    this.tooltip = d3.select(this.refs.tooltip);

    this.yScaleLeft = d3.scaleLinear().range([this.height, 0]);
    this.yScaleRight = d3.scaleLinear().range([this.height, 0]);

    this.refs.elem.innerHTML = "";

    const svg = d3
      .select(this.refs.elem)
      .append("svg")
      .attr("width", this.width + this.padding * 1.5)
      .attr("height", this.height + this.padding);

    const background = svg
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", this.width + this.padding * 1.5)
      .attr("height", this.height + this.padding)
      .attr("fill", "white");

    this.blockBox = svg
      .append("g")
      .attr("transform", `translate(${this.padding / 1.5}, 10)`);

    this.container = svg
      .append("g")
      .attr("transform", `translate(${this.padding / 1.5}, 10)`);

    this.axisBottomContainer = this.container
      .append("g")
      .attr("class", bottom_axis);

    this.grid = this.container.append("g").attr("class", horizontal_grid);

    this.barChartContainer = this.container.append("g");
    this.transitionContainer = this.container.append("g");

    this.numbersOutline = this.container.append("g");
    this.numbers = this.container.append("g");
  }

  render() {
    let d = this.state.activeTooltip;

    let totalScore = 0;
    this.props.data.forEach(s => (totalScore += s.val || 0));

    return (
      <div style={{ textAlign: "center" }}>
        <div ref="elem" />

        <div ref="tooltip" className={tooltip_class}>
          <div className={tooltip_inner}>
            {d && (
              <div>
                <div className={tooltip_header}>
                  <div className={tooltip_title}>{d.label}</div>

                  <div className={tooltip_stat}>{d.val}</div>
                </div>

                <div className={tooltip_list}>
                  {this.getCompanyList(d.id).map((orgName, i) => (
                    <div
                      key={`${d.id}-${orgName}-${i}`}
                      className={tooltip_list_item}
                    >
                      {orgName}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default FunnelChart;
