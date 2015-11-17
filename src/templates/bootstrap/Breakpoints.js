import t from 'tcomb-validation';
import bootstrap from 'uvdom-bootstrap';

const Positive = t.subtype(t.Num, function (n) {
  return n % 1 === 0 && n >= 0;
}, 'Positive');

const Cols = t.tuple([Positive, Positive], 'Cols');

const Breakpoints = t.struct({
  xs: t.maybe(Cols),
  sm: t.maybe(Cols),
  md: t.maybe(Cols),
  lg: t.maybe(Cols)
}, 'Breakpoints');

Breakpoints.prototype.getBreakpoints = function (index) {
  const breakpoints = {};
  for (const size in this) {
    if (this.hasOwnProperty(size) && !t.Nil.is(this[size])) {
      breakpoints[size] = this[size][index];
    }
  }
  return breakpoints;
};

Breakpoints.prototype.getLabelClassName = function () {
  return bootstrap.getBreakpoints(this.getBreakpoints(0));
};

Breakpoints.prototype.getInputClassName = function () {
  return bootstrap.getBreakpoints(this.getBreakpoints(1));
};

Breakpoints.prototype.getOffsetClassName = function () {
  return t.mixin(bootstrap.getOffsets(this.getBreakpoints(1)), bootstrap.getBreakpoints(this.getBreakpoints(1)));
};

export default Breakpoints;
