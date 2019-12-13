import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

import { from, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

const MeactReduxContext = createContext();

// Provider as ClassComponent
export class ClassProvider extends React.Component {
  state = {
    dispatch: null,
    reduxState: {}
  };

  unsubscribe$ = new Subject();

  componentDidMount() {
    from(this.props.store)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(reduxState => this.setState({ reduxState }));
  }

  componentWillUnmount() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  render() {
    return (
      <MeactReduxContext.Provider value={this.state.reduxState}>
        {this.props.children}
      </MeactReduxContext.Provider>
    );
  }
}

// Provider as FunctionComponent
export const Provider = ({ children, store }) => {
  const [state, setState] = useState({});

  useEffect(() => {
    const unsubscribe$ = new Subject();

    from(store)
      .pipe(takeUntil(unsubscribe$))
      .subscribe(state => setState(state));

    return () => {
      unsubscribe$.next();
      unsubscribe$.complete();
    };
  }, [store]);

  const value = {
    state,
    dispatch: store.dispatch.bind(store)
  };

  return (
    <MeactReduxContext.Provider value={value}>
      {children}
    </MeactReduxContext.Provider>
  );
};

// HOC API
export const connect = (mapStateToProps, mapDispatchToProps) => Component => {
  return class ConnectedComponent extends React.Component {
    render() {
      return (
        <MeactReduxContext.Consumer>
          {({ state, dispatch }) => {
            const props = {
              ...this.getStateProps(mapStateToProps, state),
              ...this.getDispatchProps(mapDispatchToProps, dispatch)
            };

            return <Component {...props} {...this.props} />;
          }}
        </MeactReduxContext.Consumer>
      );
    }

    getStateProps(mapStateToProps, state) {
      let stateProps = {};

      if (typeof mapStateToProps === 'function') {
        stateProps = mapStateToProps(state);
      }

      return stateProps;
    }

    getDispatchProps(mapDispatchToProps, dispatch) {
      let dispatchProps = {};

      if (typeof mapDispatchToProps === 'function') {
        dispatchProps = mapDispatchToProps(dispatch, this.props);
      } else if (typeof mapDispatchToProps === 'object') {
        for (const key in mapDispatchToProps) {
          const wrappedFn = (...args) =>
            dispatch(mapDispatchToProps[key](...args));

          dispatchProps[key] = wrappedFn;
        }
      }

      return dispatchProps;
    }
  };
};

// Hooks API
export const useSelector = selector => {
  const { state } = useContext(MeactReduxContext);

  const value = useMemo(() => {
    return selector(state);
  }, [selector, state]);

  return value;
};

export const useDispatch = () => {
  const { dispatch } = useContext(MeactReduxContext);

  return dispatch;
};
