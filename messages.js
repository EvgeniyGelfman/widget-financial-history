/* eslint-disable max-len, max-lines */

const joi = require('@opower/config-schema');
const {defineSymphony} = require('@opower/config-schema/symphony');

const s = defineSymphony({
    tabs: {
        messages: {
            title: 'Messages',
            order: 0,
            categories: {
                'widget-financial-history': {
                    title: 'Widget Financial History',
                    order: 0,
                    groups: {
                        general: {
                            title: 'General',
                            order: 0
                        }
                    }
                }
            }
        }
    }
});

module.exports = joi.object().keys({
    TITLE: joi.string()
        .symphony(s({
            placements: ['messages.widget-financial-history.general']
        })),
    HISTORY_TABLE: joi.object()
        .keys({
            A11Y: joi.object()
                .keys({
                    SUMMARY: joi.string()
                        .symphony(s({
                            placements: ['messages.widget-financial-history.general']
                        }))
                }),
            HEADER: joi.object()
                .keys({
                    DATE: joi.string()
                        .symphony(s({
                            placements: ['messages.widget-financial-history.general']
                        })),
                    ACTIVITY: joi.string()
                        .symphony(s({
                            placements: ['messages.widget-financial-history.general']
                        })),
                    AMOUNT: joi.string()
                        .symphony(s({
                            placements: ['messages.widget-financial-history.general']
                        }))
                }),
            ACTIVITY: joi.object()
                .keys({
                    SCHEDULED: joi.string()
                        .symphony(s({
                            placements: ['messages.widget-financial-history.general']
                        })),
                    PAYMENT: joi.string()
                        .symphony(s({
                            placements: ['messages.widget-financial-history.general']
                        })),
                    PAYMENT_CANCELLED: joi.string()
                        .symphony(s({
                            placements: ['messages.widget-financial-history.general']
                        })),
                    BILL: joi.string()
                        .symphony(s({
                            placements: ['messages.widget-financial-history.general']
                        }))
                }),
            ACTIVITY_DETAILS: joi.object()
                .keys({
                    TOTAL: joi.string()
                        .symphony(s({
                            placements: ['messages.widget-financial-history.general']
                        }))
                }),
            NO_DATA: joi.string()
                .symphony(s({
                    placements: ['messages.widget-financial-history.general']
                }))
        }),
    NO_DATA: joi.object()
        .keys({
            HEADING: joi.string()
                .symphony(s({
                    placements: ['messages.widget-financial-history.general']
                })),
            SUB_HEADING: joi.string()
                .symphony(s({
                    placements: ['messages.widget-financial-history.general']
                })),
            RETURN_TO_OVERVIEW: joi.string()
                .symphony(s({
                    placements: ['messages.widget-financial-history.general']
                }))
        }),
    VIEW_BILL_DETAILS: joi.string()
        .symphony(s({
            placements: ['messages.widget-financial-history.general']
        })),
    PAYMENT_DETAILS: joi.object()
        .keys({
            METHOD: joi.string()
                .symphony(s({
                    placements: ['messages.widget-financial-history.general']
                })),
            CONFIRMATION: joi.string()
                .symphony(s({
                    placements: ['messages.widget-financial-history.general']
                })),
            PAYMENT_METHOD: joi.object()
                .keys({
                    27: joi.string()
                        .symphony(s({
                            placements: ['messages.widget-financial-history.general']
                        })),
                    37: joi.string()
                        .symphony(s({
                            placements: ['messages.widget-financial-history.general']
                        })),
                    47: joi.string()
                        .symphony(s({
                            placements: ['messages.widget-financial-history.general']
                        })),
                    CHECKING_ACCOUNT: joi.string()
                        .symphony(s({
                            placements: ['messages.widget-financial-history.general']
                        })),
                    SAVINGS_ACCOUNT: joi.string()
                        .symphony(s({
                            placements: ['messages.widget-financial-history.general']
                        })),
                    CREDITCARD: joi.string()
                        .symphony(s({
                            placements: ['messages.widget-financial-history.general']
                        }))
                }),
            CARD_TYPE: joi.object()
                .keys({
                    C1VS: joi.string()
                        .symphony(s({
                            placements: ['messages.widget-financial-history.general']
                        })),
                    C1AM: joi.string()
                        .symphony(s({
                            placements: ['messages.widget-financial-history.general']
                        })),
                    C1DV: joi.string()
                        .symphony(s({
                            placements: ['messages.widget-financial-history.general']
                        })),
                    C1MC: joi.string()
                        .symphony(s({
                            placements: ['messages.widget-financial-history.general']
                        }))
                })
        }),
    CANCEL_PAYMENT: joi.string()
        .symphony(s({
            placements: ['messages.widget-financial-history.general']
        })),
    SCHEDULED_PAYMENT_DETAILS: joi.object()
        .keys({
            TOTAL: joi.string()
                .symphony(s({
                    placements: ['messages.widget-financial-history.general']
                })),
            SCHEDULED_FOR: joi.string()
                .symphony(s({
                    placements: ['messages.widget-financial-history.general']
                })),
            DESCRIPTION: joi.string()
                .symphony(s({
                    placements: ['messages.widget-financial-history.general']
                })),
            ACCOUNT: joi.string()
                .symphony(s({
                    placements: ['messages.widget-financial-history.general']
                }))
        }),
    DATE_FILTER: joi.object()
        .keys({
            LABEL: joi.object()
                .keys({
                    ALL_DATES: joi.string()
                        .symphony(s({
                            placements: ['messages.widget-financial-history.general']
                        })),
                    THIS_YEAR_DATES: joi.string()
                        .symphony(s({
                            placements: ['messages.widget-financial-history.general']
                        })),
                    LAST_YEAR_DATES: joi.string()
                        .symphony(s({
                            placements: ['messages.widget-financial-history.general']
                        }))
                }),
            A11Y: joi.object()
                .keys({
                    LABEL: joi.object()
                        .keys({
                            SELECT_RANGE: joi.string()
                                .symphony(s({
                                    placements: ['messages.widget-financial-history.general']
                                }))
                        })
                })
        }),
    TRANSACTION_FILTER: joi.object()
        .keys({
            LABEL: joi.object()
                .keys({
                    ALL_TRANSACTIONS: joi.string()
                        .symphony(s({
                            placements: ['messages.widget-financial-history.general']
                        })),
                    PENDING_TRANSACTIONS: joi.string()
                        .symphony(s({
                            placements: ['messages.widget-financial-history.general']
                        })),
                    Bills: joi.string()
                        .symphony(s({
                            placements: ['messages.widget-financial-history.general']
                        })),
                    Payments: joi.string()
                        .symphony(s({
                            placements: ['messages.widget-financial-history.general']
                        }))
                }),
            A11Y: joi.object()
                .keys({
                    LABEL: joi.object()
                        .keys({
                            SELECT_RANGE: joi.string()
                                .symphony(s({
                                    placements: ['messages.widget-financial-history.general']
                                }))
                        })
                })
        }),
    FILTER: joi.object()
        .keys({
            A11Y: joi.object()
                .keys({
                    LABEL: joi.object()
                        .keys({
                            CLEAR: joi.string()
                                .symphony(s({
                                    placements: ['messages.widget-financial-history.general']
                                }))
                        })
                })
        }),
    PAGINATION_CONTROL: joi.object()
        .keys({
            PROGRESS: joi.string()
                .symphony(s({
                    placements: ['messages.widget-financial-history.general']
                })),
            A11Y: joi.object()
                .keys({
                    LABEL: joi.object()
                        .keys({
                            PREVIOUS_PAGE: joi.string()
                                .symphony(s({
                                    placements: ['messages.widget-financial-history.general']
                                })),
                            NEXT_PAGE: joi.string()
                                .symphony(s({
                                    placements: ['messages.widget-financial-history.general']
                                }))
                        })
                })
        }),
    A11Y: joi.object()
        .keys({
            LABEL: joi.object()
                .keys({
                    SPINNER: joi.object()
                        .keys({
                            INDICATOR: joi.string()
                                .symphony(s({
                                    placements: ['messages.widget-financial-history.general']
                                }))
                        })
                }),
            DOWNLOAD_HISTORY: joi.object()
                .keys({
                    SPINNER: joi.object()
                        .keys({
                            INDICATOR: joi.string()
                                .symphony(s({
                                    placements: ['messages.widget-financial-history.general']
                                }))
                        })
                })
        }),
    ERROR: joi.object()
        .keys({
            HEADING: joi.string()
                .symphony(s({
                    placements: ['messages.widget-financial-history.general']
                })),
            SUB_HEADING: joi.string()
                .symphony(s({
                    placements: ['messages.widget-financial-history.general']
                })),
            TRY_AGAIN: joi.string()
                .symphony(s({
                    placements: ['messages.widget-financial-history.general']
                }))
        }),
    DOWNLOAD_HISTORY: joi.object()
        .keys({
            TITLE: joi.string()
                .symphony(s({
                    placements: ['messages.widget-financial-history.general']
                }))
        }),
    REPORT: joi.object()
        .keys({
            CSV: joi.object()
                .keys({
                    HEADERS: joi.object()
                        .keys({
                            DATE: joi.string()
                                .symphony(s({
                                    placements: ['messages.widget-financial-history.general']
                                })),
                            ACTIVITY: joi.string()
                                .symphony(s({
                                    placements: ['messages.widget-financial-history.general']
                                })),
                            AMOUNT: joi.string()
                                .symphony(s({
                                    placements: ['messages.widget-financial-history.general']
                                })),
                            CURRENCY: joi.string()
                                .symphony(s({
                                    placements: ['messages.widget-financial-history.general']
                                })),
                            CURRENCY_CODE: joi.string()
                                .symphony(s({
                                    placements: ['messages.widget-financial-history.general']
                                })),
                            PAYMENT_ID: joi.string()
                                .symphony(s({
                                    placements: ['messages.widget-financial-history.general']
                                })),
                            BILL_ID: joi.string()
                                .symphony(s({
                                    placements: ['messages.widget-financial-history.general']
                                })),
                            ACCOUNT_NUMBER: joi.string()
                                .symphony(s({
                                    placements: ['messages.widget-financial-history.general']
                                })),
                            BANK_NAME: joi.string()
                                .symphony(s({
                                    placements: ['messages.widget-financial-history.general']
                                }))
                        })
                })
        })
});
