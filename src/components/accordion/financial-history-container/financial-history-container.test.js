import React from 'react';
import {assert} from 'chai';
import {I18nextProvider} from 'react-i18next';
import {Provider as ReduxProvider} from 'react-redux';
import TestRenderer, {act} from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import sinon from 'sinon';

import i18nMock from '@opower/i18next-config/mock';
import {MockConfigProvider} from '@opower/maestro-react/mock';

import {namespace} from '../../namespace';
import {Layout} from '../layout';

import {FinancialHistoryContainerView as Subject} from './financial-history-container';

const createMockStore = configureMockStore();

const getSubject = (store, state, fetchHistorySpy, fetchPaymentsSpy, fetchSelectedAccountSpy) => (
    <ReduxProvider store={store}>
        <I18nextProvider i18n={i18nMock}>
            <MockConfigProvider
                widgetConfig={{numberOfViewableBillYears: 5, numberOfRecordsPerPage: 1, csvFields: ''}}
                getExperienceLink={() => ({url: '/xyz', target: '_self'})}
            >
                <Subject
                    {...state}
                    numberOfViewableBillYears={5}
                    numberOfRecordsPerPage={1}
                    fetchFinancialHistoryIfNecessary={fetchHistorySpy}
                    fetchScheduledPayments={fetchPaymentsSpy}
                    loadSelectedAccountIfNecessary={fetchSelectedAccountSpy}
                />
            </MockConfigProvider>
        </I18nextProvider>
    </ReduxProvider>
);

const setup = (initialState, nextState) => {
    const fetchHistorySpy = sinon.spy();
    const fetchPaymentsSpy = sinon.spy();
    const fetchSelectedAccountSpy = sinon.spy();
    const store = createMockStore({[namespace]: {pageNumber: 1}});
    let renderer;

    // https://reactjs.org/docs/hooks-faq.html#how-to-test-components-that-use-hooks
    // React does not call useEffect on shallow render, so we need to flush it with act()
    act(() => {
        renderer = TestRenderer.create(getSubject(
            store, initialState,
            fetchHistorySpy, fetchPaymentsSpy, fetchSelectedAccountSpy
        ));
    });

    // for testing after the first mount, set Subject with the next state
    if (nextState) {
        // reset the call counts after component is mounted
        fetchHistorySpy.resetHistory();
        fetchPaymentsSpy.resetHistory();
        fetchSelectedAccountSpy.resetHistory();

        // https://reactjs.org/docs/test-renderer.html#testrendererupdate
        // If the new element has the same type and key as the previous element, the tree will be updated
        act(() => {
            renderer.update(getSubject(
                store, nextState,
                fetchHistorySpy, fetchPaymentsSpy, fetchSelectedAccountSpy
            ));
        });
    }

    return {wrapper: renderer.root, fetchHistorySpy, fetchPaymentsSpy, fetchSelectedAccountSpy};
};

describe('FinancialHistoryContainer', () => {
    let initialState;

    beforeEach(() => {
        initialState = {
            paginatorId: 'ALL_DATES',
            pageNumber: 1,
            selectedAccountId: '123123123'
        };
    });

    it('renders Layout component', () => {
        const {wrapper} = setup(initialState);

        assert.exists(wrapper.findByType(Layout), 'renders Layout correctly');
    });

    it('call fetches when widget is mounted', () => {
        const {fetchHistorySpy, fetchPaymentsSpy, fetchSelectedAccountSpy} = setup(initialState);

        assert.strictEqual(fetchHistorySpy.callCount, 1, 'fetch history is called once on mount');

        assert.strictEqual(fetchSelectedAccountSpy.callCount, 1, 'loadSelectedAccount should be called on mount');

        assert.deepEqual(
            fetchHistorySpy.getCall(0).args[0],
            {numberOfRecordsPerPage: 1, numberOfViewableBillYears: 5}
        );

        assert.strictEqual(fetchPaymentsSpy.callCount, 1, 'fetch scheduled payments called once on mount');
    });

    it('does not call fetch scheduled payments & selectedAccount on subsequent updates', () => {
        const nextState = {
            paginatorId: 'TODAY_DATES',
            pageNumber: 1,
            selectedAccountId: '123123123'
        };
        const {fetchPaymentsSpy, fetchSelectedAccountSpy} = setup(initialState, nextState);

        assert.strictEqual(fetchPaymentsSpy.callCount, 0, 'fetch scheduled payments not called on updates');
        assert.strictEqual(fetchSelectedAccountSpy.callCount, 0,
            'fetch selected account not called on non-related updates');
    });

    it('calls fetch history when paginatorId or pageNumber is updated', () => {
        const mockStateWithUpdatedPaginator = {
            paginatorId: 'TODAY_DATES',
            pageNumber: 1,
            selectedAccountId: '123123123'
        };
        const {fetchHistorySpy: spyAfterPaginatorChange} = setup(initialState, mockStateWithUpdatedPaginator);

        assert.strictEqual(spyAfterPaginatorChange.callCount, 1, 'fetch history is called after paginator updates');

        const mockStateWithUpdatedPageNumber = {
            paginatorId: 'ALL_DATES',
            pageNumber: 2,
            selectedAccountId: '123123123'
        };
        const {fetchHistorySpy: spyAfterPageNumberChange} = setup(initialState, mockStateWithUpdatedPageNumber);

        assert.strictEqual(spyAfterPageNumberChange.callCount, 1, 'fetch history is called after pageNumber updates');

        const mockStateWithOtherChange = {
            paginatorId: 'ALL_DATES',
            pageNumber: 1,
            selectedAccountId: '123123123',
            accordion: {0: false}
        };
        const {fetchHistorySpy: spyAfterOtherChange} = setup(initialState, mockStateWithOtherChange);

        assert.strictEqual(spyAfterOtherChange.callCount, 0, 'fetch history is not called after irrelevant updates');
    });

    it('calls fetch history when selected account is updated', () => {
        const mockStateWithUpdatedAccount = {
            paginatorId: 'TODAY_DATES',
            pageNumber: 1,
            selectedAccountId: '111111111'
        };

        const {fetchHistorySpy, fetchPaymentsSpy} = setup(initialState, mockStateWithUpdatedAccount);

        assert.strictEqual(fetchHistorySpy.callCount, 1, 'fetch history is called after account is updated');
        assert.strictEqual(fetchPaymentsSpy.callCount, 1, 'fetch payments is called after account is updated');

        assert.deepEqual(
            fetchHistorySpy.getCall(0).args[0],
            {numberOfRecordsPerPage: 1, numberOfViewableBillYears: 5}
        );

        assert.deepEqual(fetchPaymentsSpy.getCall(0).args[0], '111111111');
    });
});
