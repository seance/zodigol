import React from 'react'
import PropTypes from 'prop-types'
import xstream from 'xstream'
import dropRepeats from 'xstream/extra/dropRepeats'
import * as R from 'ramda'
import * as L from 'partial.lenses'

export const createAction = () => {
  const stream = xstream.create()
  const action = value => stream.shamefullySendNext(value)
  action.$ = stream

  return action
}

export const replaceState = R.always

export const effectReducer = (action, handler) =>
  action.$.debug(handler).map(() => R.identity)


export const scopeReducer = (reducer, optic) =>
  reducer.map(mapper => state => L.modify(optic, mapper, state))

export const combineReducers = reducers =>
  reducers.length === 0 ? xstream.never() :
  reducers.length === 1 ? reducers[0] :
  xstream.merge(...reducers)

export const createState = (reducer, initialState) =>
  reducer.fold((state, mapper) => mapper(state), initialState)
    .compose(dropRepeats(R.equals))
    .remember()

export const connect = Component => selector => {
  return class Connect extends React.Component {

    static contextTypes = {
      state$: PropTypes.object.isRequired
    }

    constructor(props) {
      super(props)
      this.props$ = xstream.of(props).remember()
    }

    componentWillMount() {
      const state$ =
        xstream.combine(this.context.state$, this.props$)
          .map(([state, props]) => selector(state, props))
          .compose(dropRepeats(R.equals))

      this.subscription = state$.subscribe({
        next: values => this.setState(values)
      })
    }

    componentWillReceiveProps(newProps) {
      this.props$.shamefullySendNext(newProps)
    }

    componentWillUnmount() {
      this.subscription.unsubscribe()
    }

    render() {
      return <Component {...this.state}/>
    }
  }
}

export class StateProvider extends React.Component {

  static childContextTypes = {
    state$: PropTypes.object.isRequired
  }

  getChildContext() {
    return {
      state$: this.props.state$
    }
  }

  render() {
    return <div>{this.props.children}</div>
  }
}
