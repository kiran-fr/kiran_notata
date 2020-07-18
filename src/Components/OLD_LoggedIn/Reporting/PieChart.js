import React from "react";
import * as d3 from "d3";
import colors from "./colors";
import {
  container,
  svg_container,
  legend_container,
  legend,
  legend_block,
  legend_name
} from "./PieChart.module.css";

const arcTween = (oldData, newData, arc) => {
  const copy = { ...oldData };
  return () => {
    const interpolateStartAngle = d3.interpolate(
        oldData.startAngle,
        newData.startAngle
      ),
      interpolateEndAngle = d3.interpolate(oldData.endAngle, newData.endAngle);
    return t => {
      copy.startAngle = interpolateStartAngle(t);
      copy.endAngle = interpolateEndAngle(t);
      return arc(copy);
    };
  };
};

class Arc extends React.Component {
  arc = d3
    .arc()
    .innerRadius(110)
    .outerRadius(150);

  constructor(props) {
    super(props);
    this.state = {
      // active: false,
      d: props.d,
      pathD: this.arc(props.d)
    };
  }

  componentWillReceiveProps(newProps) {
    d3.select(this.refs.elem)
      .transition()
      .duration(500)
      .attrTween("d", arcTween(this.state.d || 0, newProps.d || 0, this.arc))
      .on("end", () =>
        this.setState({
          d: newProps.d,
          pathD: this.arc(newProps.d)
        })
      );
  }

  render() {
    const { pathD } = this.state;
    return (
      <path
        d={pathD}
        className={this.props.className}
        ref="elem"
        stroke={"white"}
        style={{
          strokeWidth: "2px",
          ...this.props.style
        }}
        onMouseEnter={() => {
          this.props.setActive(this.state.d.data);
        }}
        onMouseLeave={() => {
          this.props.setActive(null);
        }}
      />
    );
  }
}

const chunk = (array, size) => {
  const chunked_arr = [];
  for (let i = 0; i < array.length; i++) {
    const last = chunked_arr[chunked_arr.length - 1];
    if (!last || last.length === size) {
      chunked_arr.push([array[i]]);
    } else {
      last.push(array[i]);
    }
  }
  return chunked_arr;
};

class PieChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: null,
      collectOn: false
    };
  }

  render() {
    let { score } = this.props;

    let width = 340;
    let height = 340;
    let createPie = d3
      .pie()
      .value(d => d.val)
      .sort(null);
    let data = createPie(score);

    let totalScore = 0;
    score.forEach(s => (totalScore += s.val || 0));

    let chunks = chunk(score, 10);
    if (chunks.length >= 2) chunks.length = 2;
    if (this.props.half) chunks.length = 1;

    return (
      <div style={{ textAlign: "center" }}>
        <div className={container}>
          <div className={svg_container}>
            <svg height={height} width={width}>
              <g transform={`translate(${width / 2}, ${height / 2})`}>
                {data.map((s, i) => {
                  return (
                    <Arc
                      key={`slice-${i}`}
                      d={s}
                      style={{ fill: colors[i] }}
                      setActive={active => {
                        this.setState({ active });
                      }}
                    />
                  );
                })}
              </g>

              <g transform={`translate(${width / 2}, ${height / 2})`}>
                {data.map((s, i) => {
                  return (
                    <Arc
                      key={`slice-${i}`}
                      d={s}
                      style={{
                        fill: this.state.active === s.data ? colors[i] : "none",
                        stroke:
                          this.state.active === s.data ? colors[i] : "none",
                        strokeWidth:
                          this.state.active === s.data ? "6px" : "2px"
                      }}
                      setActive={active => {
                        this.setState({ active });
                      }}
                    />
                  );
                })}
              </g>

              {this.state.active && (
                <g
                  transform={`translate(${width / 2}, ${height / 2})`}
                  style={{ fill: "#fff" }}
                >
                  <text
                    style={{
                      textAnchor: "middle",
                      fontSize: "20px",
                      stroke: "white",
                      strokeWidth: "3px",
                      strokeLinecap: "butt",
                      strokeLinejoin: "miter"
                    }}
                  >
                    {this.state.active.label}
                  </text>
                  <text
                    style={{ textAnchor: "middle" }}
                    transform={`translate(0, 25)`}
                  >
                    {this.state.active.val} /{" "}
                    {Math.round((this.state.active.val / totalScore) * 100)}%
                  </text>
                </g>
              )}

              {this.state.active && (
                <g
                  transform={`translate(${width / 2}, ${height / 2})`}
                  style={{ fill: "#999" }}
                >
                  <text style={{ textAnchor: "middle", fontSize: "20px" }}>
                    {this.state.active.label}
                  </text>
                  <text
                    style={{ textAnchor: "middle" }}
                    transform={`translate(0, 25)`}
                  >
                    {this.state.active.val} /{" "}
                    {Math.round((this.state.active.val / totalScore) * 100)}%
                  </text>
                </g>
              )}
            </svg>
          </div>

          {chunks.map((c, i) => (
            <div className={legend_container} key={`chunk-${i}`}>
              {c.map((s, ii) => (
                <div
                  className={legend}
                  key={`s-legend-${i}-${ii}`}
                  onMouseEnter={() => {
                    this.setState({ active: s });
                  }}
                  onMouseLeave={() => {
                    this.setState({ active: null });
                  }}
                >
                  <div
                    className={legend_block}
                    style={{ background: colors[i * 10 + ii] }}
                  />
                  <div className={legend_name}>{s.label}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default PieChart;
