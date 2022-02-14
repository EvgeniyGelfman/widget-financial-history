import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

chai.use(chaiEnzyme());
Enzyme.configure({adapter: new Adapter()});
