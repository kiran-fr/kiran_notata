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
} from "./BarChart.module.css";

class BarChart extends React.Component {
  constructor(props) {
    super(props);
    // this.width = (this.props.data || []).length > 8 ? 850 : 350;
    this.width = this.props.half ? 350 : 850;
    this.height = 250;
    this.heightMultiplier = 1;
    this.padding = 90;
    this.gap = 3;

    this.state = {
      activeTooltip: {}
    };
  }

  componentDidMount() {
    this.drawChart();
    let data = this.props.data || [];
    if (!data.length) return;
    let min, max;
    if (data.length === 1) {
      min = data.reduce((a, b) => Math.min(a.val || a || 0, b.val));
      max = data.reduce((a, b) => Math.max(a.val || a || 0, b.val));      
    } else {
      min = data[0].val;
      max = data[0].val;
    }
    this.updateBarChart({ min, max, data });
  }

  componentWillReceiveProps(newProps) {
    this.width = newProps.half ? 350 : 850;
    this.drawChart();
    let data = newProps.data || [];
    if (!data.length) return;
    let min, max;
    if (data.length === 1) {
      min = data.reduce((a, b) => Math.min(a.val || a || 0, b.val));
      max = data.reduce((a, b) => Math.max(a.val || a || 0, b.val));      
    } else {
      min = data[0].val;
      max = data[0].val;
    }

    this.updateBarChart({ min, max, data });
  }

  getCompanyList(tagID) {
    let { evaluations } = this.props;
    let orgs = evaluations
      .filter(e => (e.n_tags || []).some(nt => nt === tagID))
      .map(e => (e.organization || {}).name);

    if (orgs.length > 5) {
      let extras = orgs.length - 5;
      orgs.length = 5;
      orgs.push(`... ${extras} more`);
    }
    return orgs;
  }

  updateBarChart({ min, max, data }) {
    this.yScaleLeft.domain([min, max]);

    let yAxis = d3.axisLeft(this.yScaleLeft).ticks(5);
    this.axisLeftContainer.call(yAxis);

    this.grid.call(
      d3
        .axisLeft(this.yScaleLeft)
        .tickSize(-this.width)
        .tickFormat("")
    );

    let selection = this.barChartContainer.selectAll("rect").data(data);

    selection
      .enter()
      .append("rect")
      .attr("y", d => this.height - (d.val / max) * this.height)
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

    selection.exit().remove();

    let x = d3
      .scaleBand()
      .domain(d3.range(data.length))
      .range([0, this.width])
      .padding(0.1);

    let xAxis = g =>
      g.attr("transform", `translate(0,${this.height + 3})`).call(
        d3
          .axisBottom(x)
          .tickFormat(i => data[i].label)
          .tickSizeOuter(0)
      );

    this.axisBottomContainer
      .call(xAxis)
      .selectAll("text")
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .attr("transform", "rotate(30)");
  }

  drawChart() {
    this.refs.elem.innerHTML = "";
    this.tooltip = d3.select(this.refs.tooltip);

    this.yScaleLeft = d3.scaleLinear().range([this.height, 0]);
    this.yScaleRight = d3.scaleLinear().range([this.height, 0]);

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

    this.axisLeftContainer = this.container
      .append("g")
      .attr("transform", `translate(-10, 0)`)
      .attr("class", left_axis);

    this.axisRightContainer = this.container
      .append("g")
      .attr("transform", `translate(${this.width + 4}, 0)`)
      .attr("class", right_axis);

    this.axisBottomContainer = this.container
      .append("g")
      .attr("class", bottom_axis);

    this.grid = this.container.append("g").attr("class", horizontal_grid);

    this.barChartContainer = this.container.append("g");
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

                  <div className={tooltip_stat}>
                    {d.val} / {Math.round((d.val / totalScore) * 100)}%
                  </div>
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

export default BarChart;
