
import { Functions as fn } from 'dayspan';


export function dsMerge(target, source)
{
  if (!fn.isObject(target))
  {
    return source;
  }

  if (fn.isObject(source))
  {
    for (let prop in source)
    {
      let sourceValue = source[ prop ];

      if (prop in target)
      {
        dsMerge( target[ prop ], sourceValue );
      }
      else
      {
        target[ prop ] = sourceValue;
      }
    }
  }

  return target;
}

export function dsMergeOptions(options, defaults)
{
  let out = {
    data: {},
    methods: {},
    computed: {}
  };

  dsMergeOptionsGroup( options, defaults.data, out, out.data );
  dsMergeOptionsGroup( options, defaults.computed, out, out.computed );
  dsMergeOptionsGroup( options, defaults.methods, out, out.methods );

  return out;
}

export function dsMergeOptionsGroup(options, group, out, outGroup)
{
  for (let prop in group)
  {
    if (options.data && prop in options.data)
    {
      out.data[ prop ] = options.data[ prop ];

      dsMerge( out.data[ prop ], group[ prop ] );
    }
    else if (options.computed && prop in options.computed)
    {
      out.computed[ prop ] = options.computed[ prop ];

      dsMerge( out.computed[ prop ], group[ prop ] );
    }
    else if (options.methods && prop in options.methods)
    {
      out.methods[ prop ] = options.methods[ prop ];

      dsMerge( out.methods[ prop ], group[ prop ] );
    }
    else
    {
      outGroup[ prop ] = group[ prop ];
    }
  }
}

export function dsMergeValidate(target, source)
{
  return dsMerge( target, source ) !== source;
}

export function dsValidate(input, property)
{
  return dsMergeValidate( input, this.$dsDefaults()[ property ] );
}

export function dsDefaults()
{
  return this.$dayspan.defaults[ this.$options.name ];
}

export function dsBind(bind)
{
  return function(data, tag, value, asProp, isSync)
  {
    if (value && value.$scopedSlots)
    {
      data.scopedSlots = value.$scopedSlots;
      delete value.$scopedSlots;
    }

    return bind.apply(this, arguments);
  };
}
